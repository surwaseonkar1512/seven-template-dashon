import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  GripVertical,
  Trophy,
  Award,
  Users,
  Star,
  Camera,
  TrendingUp,
  Target,
  UserCheck,
  Settings,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TemplatePreview } from './TemplatePreview';

interface AchievementItem {
  id: string;
  [key: string]: any;
}

interface AchievementSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  order: number;
  items: AchievementItem[];
  type: 'hero' | 'rankers' | 'placements' | 'awards' | 'gallery' | 'testimonials' | 'stats' | 'faculty' | 'goals';
  color: string;
  bgColor: string;
}

// Draggable Section Component
function DraggableAchievementSection({
  section,
  index,
  isSelected,
  onSelect,
  onToggle,
  moveSection
}: {
  section: AchievementSection;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'ACHIEVEMENT_SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ACHIEVEMENT_SECTION',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  const Icon = section.icon;

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform
        ${isSelected 
          ? 'shadow-xl shadow-blue-500/25 scale-105 z-10' 
          : 'hover:shadow-lg hover:scale-102'
        }
        ${isDragging ? 'rotate-2' : ''}
      `}
      onClick={() => onSelect(section.id)}
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, ${section.color}, ${section.color}dd)`
          : 'white',
        border: isSelected 
          ? `2px solid ${section.color}` 
          : '2px solid #f3f4f6'
      }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <GripVertical 
                className={`h-4 w-4 opacity-60 cursor-grab active:cursor-grabbing ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`} 
              />
              <div 
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:scale-110'
                }`}
                style={{
                  backgroundColor: !isSelected ? section.bgColor : undefined
                }}
              >
                <Icon 
                  className={`h-5 w-5 ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                  style={{
                    color: !isSelected ? section.color : undefined
                  }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate transition-colors duration-300 ${
                isSelected ? 'text-white' : 'text-gray-900'
              }`}>
                {section.name}
              </p>
              <p className={`text-sm truncate transition-colors duration-300 ${
                isSelected ? 'text-white/80' : 'text-gray-500'
              }`}>
                {section.items.length} item{section.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={section.enabled}
              onCheckedChange={(enabled) => onToggle(section.id, enabled)}
              onClick={(e) => e.stopPropagation()}
              className={`
                data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-gray-300
                ${isSelected ? 'data-[state=checked]:bg-white/30' : ''}
              `}
            />
            {!section.enabled && (
              <Badge 
                variant="secondary" 
                className={`text-xs transition-colors duration-300 ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Hidden
              </Badge>
            )}
          </div>
        </div>
        
        <p className={`text-xs truncate transition-colors duration-300 ${
          isSelected ? 'text-white/70' : 'text-gray-400'
        }`}>
          {section.description}
        </p>
      </div>
      
      {/* Animated background pattern */}
      <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${
        isSelected ? 'opacity-20' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
    </motion.div>
  );
}

export function AchievementsManagement() {
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [sections, setSections] = useState<AchievementSection[]>([
    {
      id: 'hero',
      name: 'Hero Section',
      icon: Trophy,
      description: 'Main introduction and year overview',
      enabled: true,
      order: 1,
      type: 'hero',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      items: [
        {
          id: '1',
          title: 'Achievements 2024',
          subtitle: 'A Year of Excellence and Success',
          description: 'Celebrating our remarkable achievements and the success stories that define our coaching institute.',
          backgroundImage: '',
          yearHighlight: '2024'
        }
      ]
    },
    {
      id: 'rankers',
      name: 'Top Rankers',
      icon: Star,
      description: 'Showcase top-performing students',
      enabled: true,
      order: 2,
      type: 'rankers',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        {
          id: '1',
          name: 'Arjun Sharma',
          rank: 1,
          exam: 'JEE Advanced',
          score: '350/360',
          photo: '',
          achievement: 'AIR 1'
        }
      ]
    },
    {
      id: 'placements',
      name: 'College Placements',
      icon: Award,
      description: 'Student college admission achievements',
      enabled: true,
      order: 3,
      type: 'placements',
      color: '#10b981',
      bgColor: '#d1fae5',
      items: [
        {
          id: '1',
          studentName: 'Priya Patel',
          college: 'IIT Bombay',
          branch: 'Computer Science',
          photo: '',
          rank: 'AIR 15'
        }
      ]
    },
    {
      id: 'awards',
      name: 'Awards & Recognition',
      icon: Trophy,
      description: 'Institute awards and recognitions',
      enabled: true,
      order: 4,
      type: 'awards',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      items: [
        {
          id: '1',
          title: 'Best Coaching Institute 2024',
          organization: 'Education Excellence Awards',
          date: '2024',
          description: 'Recognized for outstanding performance in JEE preparation',
          image: ''
        }
      ]
    },
    {
      id: 'gallery',
      name: 'Moments of Pride',
      icon: Camera,
      description: 'Photo gallery of proud moments',
      enabled: true,
      order: 5,
      type: 'gallery',
      color: '#ef4444',
      bgColor: '#fee2e2',
      items: [
        {
          id: '1',
          url: '',
          caption: 'Rank 1 Celebration',
          event: 'JEE Results 2024'
        }
      ]
    },
    {
      id: 'testimonials',
      name: 'Student Testimonials',
      icon: Users,
      description: 'Success stories from students',
      enabled: true,
      order: 6,
      type: 'testimonials',
      color: '#06b6d4',
      bgColor: '#cffafe',
      items: [
        {
          id: '1',
          name: 'Rahul Kumar',
          achievement: 'JEE Advanced AIR 5',
          quote: 'The guidance and support I received here was exceptional.',
          photo: '',
          batch: '2024'
        }
      ]
    },
    {
      id: 'stats',
      name: 'Performance Stats',
      icon: TrendingUp,
      description: 'Statistical achievements overview',
      enabled: true,
      order: 7,
      type: 'stats',
      color: '#84cc16',
      bgColor: '#ecfccb',
      items: [
        {
          id: '1',
          label: 'Students Qualified',
          value: '1,250',
          percentage: '95%',
          comparison: '+15% from last year'
        }
      ]
    },
    {
      id: 'faculty',
      name: 'Faculty Recognition',
      icon: UserCheck,
      description: 'Faculty achievements and recognition',
      enabled: true,
      order: 8,
      type: 'faculty',
      color: '#f97316',
      bgColor: '#fed7aa',
      items: [
        {
          id: '1',
          name: 'Dr. Rajesh Gupta',
          subject: 'Physics',
          achievement: 'Best Faculty Award 2024',
          photo: '',
          experience: '15 years'
        }
      ]
    },
    {
      id: 'goals',
      name: 'Future Goals',
      icon: Target,
      description: 'Goals and vision for upcoming years',
      enabled: true,
      order: 9,
      type: 'goals',
      color: '#ec4899',
      bgColor: '#fce7f3',
      items: [
        {
          id: '1',
          title: 'Expand to 5 New Cities',
          description: 'Bring quality education to more students across the country',
          targetDate: '2025',
          status: 'planning'
        }
      ]
    }
  ]);

  const currentSection = sections.find(s => s.id === selectedSection);

  const handleSectionToggle = useCallback((sectionId: string, enabled: boolean) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, enabled } : section
    ));
    const section = sections.find(s => s.id === sectionId);
    toast.success(`${section?.name} ${enabled ? 'enabled' : 'disabled'}`);
  }, [sections]);

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections(prev => {
      const newSections = [...prev];
      const draggedSection = newSections[dragIndex];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      
      // Update order numbers
      return newSections.map((section, index) => ({
        ...section,
        order: index + 1
      }));
    });
  }, []);

  const handleAddItem = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newItem = createEmptyItem(section.type);
    setSections(prev => prev.map(s => 
      s.id === sectionId 
        ? { ...s, items: [...s.items, newItem] }
        : s
    ));
    setEditingItem(newItem);
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
    toast.success('Item deleted successfully');
  };

  const handleSaveItem = (sectionId: string, updatedItem: AchievementItem) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            )
          }
        : section
    ));
    setEditingItem(null);
    toast.success('Item saved successfully');
  };

  const createEmptyItem = (type: AchievementSection['type']): AchievementItem => {
    const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    switch (type) {
      case 'hero':
        return {
          id,
          title: '',
          subtitle: '',
          description: '',
          backgroundImage: '',
          yearHighlight: new Date().getFullYear().toString()
        };
      case 'rankers':
        return {
          id,
          name: '',
          rank: '',
          exam: '',
          score: '',
          photo: '',
          achievement: ''
        };
      case 'placements':
        return {
          id,
          studentName: '',
          college: '',
          branch: '',
          photo: '',
          rank: ''
        };
      case 'awards':
        return {
          id,
          title: '',
          organization: '',
          date: '',
          description: '',
          image: ''
        };
      case 'gallery':
        return {
          id,
          url: '',
          caption: '',
          event: ''
        };
      case 'testimonials':
        return {
          id,
          name: '',
          achievement: '',
          quote: '',
          photo: '',
          batch: ''
        };
      case 'stats':
        return {
          id,
          label: '',
          value: '',
          percentage: '',
          comparison: ''
        };
      case 'faculty':
        return {
          id,
          name: '',
          subject: '',
          achievement: '',
          photo: '',
          experience: ''
        };
      case 'goals':
        return {
          id,
          title: '',
          description: '',
          targetDate: '',
          status: 'planning'
        };
      default:
        return { id };
    }
  };

  const renderAchievementForm = (section: AchievementSection, item: AchievementItem) => {
    switch (section.type) {
      case 'hero':
        return <HeroAchievementForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'rankers':
        return <RankersForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'placements':
        return <PlacementsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'awards':
        return <AwardsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'gallery':
        return <GalleryForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'testimonials':
        return <TestimonialsAchievementForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'stats':
        return <StatsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'faculty':
        return <FacultyAchievementForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'goals':
        return <GoalsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      default:
        return <GenericAchievementForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
    }
  };

  const getItemTitle = (item: AchievementItem, type: AchievementSection['type']): string => {
    switch (type) {
      case 'hero':
        return item.title || 'Achievement Hero';
      case 'rankers':
        return item.name || 'Top Ranker';
      case 'placements':
        return item.studentName || 'Student Placement';
      case 'awards':
        return item.title || 'Institute Award';
      case 'gallery':
        return item.caption || 'Gallery Image';
      case 'testimonials':
        return item.name || 'Student Testimonial';
      case 'stats':
        return item.label || 'Performance Stat';
      case 'faculty':
        return item.name || 'Faculty Member';
      case 'goals':
        return item.title || 'Future Goal';
      default:
        return 'Achievement Item';
    }
  };

  const renderItemPreview = (item: AchievementItem, type: AchievementSection['type']) => {
    switch (type) {
      case 'hero':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">{item.subtitle}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        );
      case 'rankers':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">{item.achievement}</p>
            <p className="text-xs text-gray-500">{item.exam} - Rank {item.rank}</p>
          </div>
        );
      case 'placements':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.studentName}</p>
            <p className="text-sm text-gray-600">{item.college}</p>
            <p className="text-xs text-gray-500">{item.branch} - {item.rank}</p>
          </div>
        );
      case 'awards':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">{item.organization}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
        );
      case 'gallery':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.caption}</p>
            <p className="text-sm text-gray-600">{item.event}</p>
          </div>
        );
      case 'testimonials':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">{item.achievement}</p>
            <p className="text-xs text-gray-500 italic">"{item.quote}"</p>
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.label}</p>
            <p className="text-sm text-gray-600">{item.value} ({item.percentage})</p>
            <p className="text-xs text-gray-500">{item.comparison}</p>
          </div>
        );
      case 'faculty':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">{item.subject}</p>
            <p className="text-xs text-gray-500">{item.achievement}</p>
          </div>
        );
      case 'goals':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-500">Target: {item.targetDate}</p>
          </div>
        );
      default:
        return <p className="text-gray-500">Achievement item content</p>;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Enhanced Sidebar - Optimized for 1200px */}
        <div className="w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl">
          <div className="p-6 xl:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Achievement Year</h2>
                <p className="text-sm text-gray-300">Manage achievement sections</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant={isPreviewMode ? "outline" : "default"}
                size="sm"
                className={`flex-1 transition-all duration-300 ${
                  !isPreviewMode 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setIsPreviewMode(false)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Mode
              </Button>
              <Button
                variant={isPreviewMode ? "default" : "outline"}
                size="sm"
                className={`flex-1 transition-all duration-300 ${
                  isPreviewMode 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setIsPreviewMode(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 xl:p-6">
            <div className="space-y-3">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <DraggableAchievementSection
                    key={section.id}
                    section={section}
                    index={index}
                    isSelected={selectedSection === section.id}
                    onSelect={setSelectedSection}
                    onToggle={handleSectionToggle}
                    moveSection={moveSection}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content - Optimized for 1200px */}
        <div className="flex-1 flex flex-col min-w-0">
          {isPreviewMode ? (
            <TemplatePreview 
              type="achievements" 
              sections={sections.filter(s => s.enabled)} 
              title="Achievement Year Preview"
            />
          ) : currentSection && (
            <>
              {/* Enhanced Header */}
              <div className="p-6 xl:p-8 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 xl:space-x-6">
                    <div 
                      className="w-12 h-12 xl:w-16 xl:h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${currentSection.color}, ${currentSection.color}dd)`
                      }}
                    >
                      <currentSection.icon className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl xl:text-2xl font-bold text-gray-900 mb-1">{currentSection.name}</h3>
                      <p className="text-gray-600 text-sm xl:text-base">{currentSection.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge 
                          variant={currentSection.enabled ? "default" : "secondary"}
                          className={`transition-all duration-300 ${
                            currentSection.enabled 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {currentSection.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {currentSection.items.length} item{currentSection.items.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddItem(currentSection.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </div>
              </div>

              {/* Enhanced Content Grid */}
              <div className="flex-1 overflow-y-auto p-6 xl:p-8">
                {currentSection.items.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: currentSection.bgColor }}
                      >
                        <currentSection.icon 
                          className="h-8 w-8"
                          style={{ color: currentSection.color }}
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Items Yet</h4>
                      <p className="text-gray-600 mb-4">Get started by adding your first achievement item</p>
                      <Button
                        onClick={() => handleAddItem(currentSection.id)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                    <AnimatePresence>
                      {currentSection.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl transform hover:scale-105 bg-white">
                            {/* Top colored bar */}
                            <div 
                              className="h-1 w-full"
                              style={{ backgroundColor: currentSection.color }}
                            ></div>
                            
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base xl:text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                                    {getItemTitle(item, currentSection.type)}
                                  </CardTitle>
                                  <CardDescription className="text-xs xl:text-sm text-gray-500 mt-1">
                                    {currentSection.type.charAt(0).toUpperCase() + currentSection.type.slice(1)} Item
                                  </CardDescription>
                                </div>
                                
                                <div className="flex items-center space-x-3 ml-4">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="icon"
                                        className="h-9 w-9 bg-blue-500 hover:bg-blue-600 text-white border-0 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                                        onClick={() => setEditingItem(item)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2">
                                      <DialogHeader className="border-b border-gray-100 pb-4">
                                        <div className="flex items-center space-x-3">
                                          <div 
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: currentSection.bgColor }}
                                          >
                                            <currentSection.icon 
                                              className="h-5 w-5" 
                                              style={{ color: currentSection.color }}
                                            />
                                          </div>
                                          <div>
                                            <DialogTitle className="text-xl font-bold text-gray-900">
                                              Edit {currentSection.name} Item
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-600">
                                              Modify the content and details for this achievement item
                                            </DialogDescription>
                                          </div>
                                        </div>
                                      </DialogHeader>
                                      <div className="p-6">
                                        {editingItem && renderAchievementForm(currentSection, editingItem)}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 bg-red-500 hover:bg-red-600 text-white border-0 hover:border-red-300 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                                    onClick={() => handleDeleteItem(currentSection.id, item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <div className="bg-gray-50 rounded-xl p-3 xl:p-4 border-2 border-gray-100 group-hover:border-gray-200 transition-all duration-300">
                                {renderItemPreview(item, currentSection.type)}
                              </div>
                            </CardContent>
                            
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

// Form Components for each achievement type
function HeroAchievementForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Main Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Achievements 2024"
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            placeholder="A Year of Excellence"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe the achievements overview..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="yearHighlight">Year Highlight</Label>
          <Input
            id="yearHighlight"
            value={formData.yearHighlight || ''}
            onChange={(e) => setFormData({...formData, yearHighlight: e.target.value})}
            placeholder="2024"
          />
        </div>
        <div>
          <Label htmlFor="backgroundImage">Background Image URL</Label>
          <Input
            id="backgroundImage"
            value={formData.backgroundImage || ''}
            onChange={(e) => setFormData({...formData, backgroundImage: e.target.value})}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function RankersForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Student name"
          />
        </div>
        <div>
          <Label htmlFor="rank">Rank</Label>
          <Input
            id="rank"
            value={formData.rank || ''}
            onChange={(e) => setFormData({...formData, rank: e.target.value})}
            placeholder="1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="exam">Exam</Label>
          <Input
            id="exam"
            value={formData.exam || ''}
            onChange={(e) => setFormData({...formData, exam: e.target.value})}
            placeholder="JEE Advanced"
          />
        </div>
        <div>
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            value={formData.score || ''}
            onChange={(e) => setFormData({...formData, score: e.target.value})}
            placeholder="350/360"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="achievement">Achievement</Label>
          <Input
            id="achievement"
            value={formData.achievement || ''}
            onChange={(e) => setFormData({...formData, achievement: e.target.value})}
            placeholder="AIR 1"
          />
        </div>
        <div>
          <Label htmlFor="photo">Photo URL</Label>
          <Input
            id="photo"
            value={formData.photo || ''}
            onChange={(e) => setFormData({...formData, photo: e.target.value})}
            placeholder="Enter photo URL"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function PlacementsForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentName">Student Name</Label>
          <Input
            id="studentName"
            value={formData.studentName || ''}
            onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            placeholder="Student name"
          />
        </div>
        <div>
          <Label htmlFor="college">College</Label>
          <Input
            id="college"
            value={formData.college || ''}
            onChange={(e) => setFormData({...formData, college: e.target.value})}
            placeholder="IIT Bombay"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            value={formData.branch || ''}
            onChange={(e) => setFormData({...formData, branch: e.target.value})}
            placeholder="Computer Science"
          />
        </div>
        <div>
          <Label htmlFor="rank">Rank</Label>
          <Input
            id="rank"
            value={formData.rank || ''}
            onChange={(e) => setFormData({...formData, rank: e.target.value})}
            placeholder="AIR 15"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="photo">Photo URL</Label>
        <Input
          id="photo"
          value={formData.photo || ''}
          onChange={(e) => setFormData({...formData, photo: e.target.value})}
          placeholder="Enter photo URL"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function AwardsForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Award Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Best Coaching Institute 2024"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            value={formData.organization || ''}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
            placeholder="Education Excellence Awards"
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            placeholder="2024"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Award description"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image || ''}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="Enter image URL"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function GalleryForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="url">Image URL</Label>
        <Input
          id="url"
          value={formData.url || ''}
          onChange={(e) => setFormData({...formData, url: e.target.value})}
          placeholder="Enter image URL"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="caption">Caption</Label>
          <Input
            id="caption"
            value={formData.caption || ''}
            onChange={(e) => setFormData({...formData, caption: e.target.value})}
            placeholder="Rank 1 Celebration"
          />
        </div>
        <div>
          <Label htmlFor="event">Event</Label>
          <Input
            id="event"
            value={formData.event || ''}
            onChange={(e) => setFormData({...formData, event: e.target.value})}
            placeholder="JEE Results 2024"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function TestimonialsAchievementForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Student name"
          />
        </div>
        <div>
          <Label htmlFor="achievement">Achievement</Label>
          <Input
            id="achievement"
            value={formData.achievement || ''}
            onChange={(e) => setFormData({...formData, achievement: e.target.value})}
            placeholder="JEE Advanced AIR 5"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          value={formData.quote || ''}
          onChange={(e) => setFormData({...formData, quote: e.target.value})}
          placeholder="Student testimonial"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="photo">Photo URL</Label>
          <Input
            id="photo"
            value={formData.photo || ''}
            onChange={(e) => setFormData({...formData, photo: e.target.value})}
            placeholder="Enter photo URL"
          />
        </div>
        <div>
          <Label htmlFor="batch">Batch</Label>
          <Input
            id="batch"
            value={formData.batch || ''}
            onChange={(e) => setFormData({...formData, batch: e.target.value})}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function StatsForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="label">Statistic Label</Label>
          <Input
            id="label"
            value={formData.label || ''}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            placeholder="Students Qualified"
          />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={formData.value || ''}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            placeholder="1,250"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="percentage">Percentage</Label>
          <Input
            id="percentage"
            value={formData.percentage || ''}
            onChange={(e) => setFormData({...formData, percentage: e.target.value})}
            placeholder="95%"
          />
        </div>
        <div>
          <Label htmlFor="comparison">Comparison</Label>
          <Input
            id="comparison"
            value={formData.comparison || ''}
            onChange={(e) => setFormData({...formData, comparison: e.target.value})}
            placeholder="+15% from last year"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function FacultyAchievementForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Faculty Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Dr. Rajesh Gupta"
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject || ''}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="Physics"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="achievement">Achievement</Label>
          <Input
            id="achievement"
            value={formData.achievement || ''}
            onChange={(e) => setFormData({...formData, achievement: e.target.value})}
            placeholder="Best Faculty Award 2024"
          />
        </div>
        <div>
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            value={formData.experience || ''}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            placeholder="15 years"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="photo">Photo URL</Label>
        <Input
          id="photo"
          value={formData.photo || ''}
          onChange={(e) => setFormData({...formData, photo: e.target.value})}
          placeholder="Enter photo URL"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function GoalsForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Expand to 5 New Cities"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Goal description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            value={formData.targetDate || ''}
            onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
            placeholder="2025"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status || 'planning'} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function GenericAchievementForm({ item, onSave }: { item: AchievementItem; onSave: (item: AchievementItem) => void }) {
  return (
    <div className="p-8 text-center">
      <p className="text-gray-500">Form for this achievement type is not yet implemented.</p>
      <Button onClick={() => onSave(item)} className="mt-4">
        Close
      </Button>
    </div>
  );
}