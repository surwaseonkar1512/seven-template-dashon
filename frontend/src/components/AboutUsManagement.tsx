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
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  GripVertical,
  Sparkles,
  Users,
  Award,
  Target,
  Heart,
  Settings,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TemplatePreview } from './TemplatePreview';

interface AboutItem {
  id: string;
  [key: string]: any;
}

interface AboutSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  order: number;
  items: AboutItem[];
  type: 'hero' | 'journey' | 'owner' | 'vision' | 'mission' | 'values' | 'team' | 'achievements';
  color: string;
  bgColor: string;
}

// Draggable Section Component
function DraggableAboutSection({
  section,
  index,
  isSelected,
  onSelect,
  onToggle,
  moveSection
}: {
  section: AboutSection;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'ABOUT_SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ABOUT_SECTION',
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

export function AboutUsManagement() {
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editingItem, setEditingItem] = useState<AboutItem | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [sections, setSections] = useState<AboutSection[]>([
    {
      id: 'hero',
      name: 'Hero Section',
      icon: Sparkles,
      description: 'Main about us banner with hero content',
      enabled: true,
      order: 1,
      type: 'hero',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      items: [
        {
          id: '1',
          title: 'About Excellence Academy',
          subtitle: 'Nurturing Dreams, Creating Success',
          description: 'With over 15 years of dedication, we have been the stepping stone for thousands of students to achieve their dreams.',
          backgroundImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop',
          buttonText: 'Our Journey',
          buttonLink: '#journey'
        }
      ]
    },
    {
      id: 'journey',
      name: 'Our Journey',
      icon: Building,
      description: 'Institute history and milestones',
      enabled: true,
      order: 2,
      type: 'journey',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      items: [
        {
          id: '1',
          title: 'Our Journey Since 2009',
          content: 'Founded in 2009 with a vision to democratize quality education, Excellence Academy started as a small institute with just 20 students. Today, we are proud to have guided over 10,000 students to success.',
          milestones: [
            { year: '2009', title: 'Foundation', description: 'Started with 20 students and 3 faculty members' },
            { year: '2012', title: 'First Major Success', description: 'Achieved 90% success rate in IIT-JEE' },
            { year: '2015', title: 'Expansion', description: 'Opened second branch and launched online classes' },
            { year: '2020', title: 'Digital Revolution', description: 'Fully integrated digital learning platform' },
            { year: '2024', title: 'Excellence Milestone', description: '10,000+ successful students' }
          ]
        }
      ]
    },
    {
      id: 'owner',
      name: 'Founder & Owner',
      icon: Users,
      description: 'Information about founders and leadership',
      enabled: true,
      order: 3,
      type: 'owner',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        {
          id: '1',
          name: 'Dr. Rajesh Sharma',
          title: 'Founder & Director',
          qualification: 'Ph.D in Physics, IIT Delhi',
          experience: '20+ years in education',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          bio: 'Dr. Rajesh Sharma founded Excellence Academy with a mission to provide quality education to every student. With over 20 years of experience in competitive exam preparation, he has personally mentored thousands of students.',
          achievements: [
            'Founded Excellence Academy in 2009',
            'Authored 15+ textbooks for competitive exams',
            'Recipient of Best Educator Award 2023',
            'Featured in top education magazines'
          ],
          philosophy: 'Education is not just about clearing exams, it\'s about building character and nurturing potential.'
        }
      ]
    },
    {
      id: 'vision',
      name: 'Vision & Mission',
      icon: Target,
      description: 'Our vision and mission statements',
      enabled: true,
      order: 4,
      type: 'vision',
      color: '#ef4444',
      bgColor: '#fee2e2',
      items: [
        {
          id: '1',
          vision: 'To be the leading education institute that transforms dreams into reality and creates future leaders.',
          mission: 'Our mission is to provide world-class education, personalized mentoring, and comprehensive support to help every student achieve their full potential in competitive examinations.',
          goals: [
            'Maintain 95%+ success rate in competitive exams',
            'Expand quality education access to rural areas',
            'Integrate technology for enhanced learning',
            'Build a community of successful alumni'
          ]
        }
      ]
    },
    {
      id: 'values',
      name: 'Core Values',
      icon: Heart,
      description: 'Our fundamental values and principles',
      enabled: true,
      order: 5,
      type: 'values',
      color: '#10b981',
      bgColor: '#d1fae5',
      items: [
        {
          id: '1',
          values: [
            {
              title: 'Excellence',
              description: 'We strive for excellence in everything we do, from teaching to student support.',
              icon: '🎯'
            },
            {
              title: 'Integrity',
              description: 'We believe in honest and transparent communication with our students and parents.',
              icon: '🤝'
            },
            {
              title: 'Innovation',
              description: 'We continuously innovate our teaching methods and embrace new technologies.',
              icon: '💡'
            },
            {
              title: 'Empowerment',
              description: 'We empower students to become confident, independent learners and thinkers.',
              icon: '🚀'
            }
          ]
        }
      ]
    },
    {
      id: 'team',
      name: 'Our Team',
      icon: Users,
      description: 'Key team members and faculty',
      enabled: false,
      order: 6,
      type: 'team',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      items: [
        {
          id: '1',
          title: 'Leadership Team',
          description: 'Meet the experienced professionals who lead our academy',
          members: [
            {
              name: 'Dr. Priya Verma',
              role: 'Academic Director',
              qualification: 'M.Sc Mathematics, IIT Bombay',
              experience: '15 years',
              image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop'
            },
            {
              name: 'Prof. Amit Kumar',
              role: 'Head of Operations',
              qualification: 'MBA Operations, IIM Ahmedabad',
              experience: '12 years',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
            }
          ]
        }
      ]
    },
    {
      id: 'achievements',
      name: 'Key Achievements',
      icon: Award,
      description: 'Major milestones and recognitions',
      enabled: true,
      order: 7,
      type: 'achievements',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        {
          id: '1',
          achievements: [
            {
              title: '10,000+ Successful Students',
              description: 'Over 10,000 students have achieved their dreams with our guidance',
              year: '2024',
              icon: '🎓'
            },
            {
              title: 'Best Coaching Institute Award',
              description: 'Recognized as the best coaching institute by Education Excellence Board',
              year: '2023',
              icon: '🏆'
            },
            {
              title: '95% Success Rate',
              description: 'Consistent 95%+ success rate in competitive examinations',
              year: '2024',
              icon: '📊'
            },
            {
              title: 'Digital Innovation Award',
              description: 'Awarded for excellence in digital education platform',
              year: '2022',
              icon: '💻'
            }
          ]
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

  const handleSaveItem = (sectionId: string, updatedItem: AboutItem) => {
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

  const createEmptyItem = (type: AboutSection['type']): AboutItem => {
    const id = Date.now().toString();
    
    switch (type) {
      case 'hero':
        return {
          id,
          title: '',
          subtitle: '',
          description: '',
          backgroundImage: '',
          buttonText: '',
          buttonLink: ''
        };
      case 'journey':
        return {
          id,
          title: '',
          content: '',
          milestones: []
        };
      case 'owner':
        return {
          id,
          name: '',
          title: '',
          qualification: '',
          experience: '',
          image: '',
          bio: '',
          achievements: [],
          philosophy: ''
        };
      case 'vision':
        return {
          id,
          vision: '',
          mission: '',
          goals: []
        };
      case 'values':
        return {
          id,
          values: []
        };
      case 'team':
        return {
          id,
          title: '',
          description: '',
          members: []
        };
      case 'achievements':
        return {
          id,
          achievements: []
        };
      default:
        return { id };
    }
  };

  const renderSectionForm = (section: AboutSection, item: AboutItem) => {
    switch (section.type) {
      case 'hero':
        return <HeroForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'journey':
        return <JourneyForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'owner':
        return <OwnerForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'vision':
        return <VisionForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'values':
        return <ValuesForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'team':
        return <TeamForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'achievements':
        return <AchievementsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      default:
        return <GenericForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Enhanced Sidebar */}
        <div className="w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl">
          <div className="p-6 xl:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-900 to-purple-800 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">About Us Management</h2>
                <p className="text-sm text-gray-300">Manage about page content</p>
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
                  <DraggableAboutSection
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

        {/* Enhanced Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {isPreviewMode ? (
            <TemplatePreview 
              type="about" 
              sections={sections.filter(s => s.enabled)} 
              title="About Us Page Preview"
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
                          {currentSection.enabled ? 'Visible' : 'Hidden'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {currentSection.items.length} items configured
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddItem(currentSection.id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4 xl:h-5 xl:w-5 mr-2" />
                    Add New Item
                  </Button>
                </div>
              </div>

              {/* Enhanced Content with Responsive Grid */}
              <div className="flex-1 overflow-y-auto p-6 xl:p-8 bg-gradient-to-br from-gray-50/50 to-white">
                {currentSection.items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center h-96 text-center"
                  >
                    <div 
                      className="w-20 h-20 xl:w-24 xl:h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${currentSection.bgColor}, ${currentSection.color}20)`
                      }}
                    >
                      <currentSection.icon 
                        className="h-10 w-10 xl:h-12 xl:w-12" 
                        style={{ color: currentSection.color }}
                      />
                    </div>
                    <h4 className="text-xl xl:text-2xl font-bold text-gray-900 mb-3">No content in this section</h4>
                    <p className="text-gray-600 mb-8 max-w-md text-sm xl:text-base">
                      Start building your {currentSection.name.toLowerCase()} by adding your first content item.
                    </p>
                    <Button 
                      onClick={() => handleAddItem(currentSection.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 xl:px-8 py-3 xl:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="h-4 w-4 xl:h-5 xl:w-5 mr-3" />
                      Create First Item
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
                    <AnimatePresence>
                      {currentSection.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -30, scale: 0.9 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="group"
                        >
                          <Card className="relative overflow-hidden bg-white border-2 border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1">
                            {/* Card accent bar */}
                            <div 
                              className="absolute top-0 left-0 right-0 h-1"
                              style={{ backgroundColor: currentSection.color }}
                            ></div>
                            
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base xl:text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                                    {getItemTitle(item, currentSection.type)}
                                  </CardTitle>
                                  <CardDescription className="text-xs xl:text-sm text-gray-500 mt-1">
                                    {currentSection.type.charAt(0).toUpperCase() + currentSection.type.slice(1)} Content
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
                                              Edit {currentSection.name} Content
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-600">
                                              Modify the content for this section
                                            </DialogDescription>
                                          </div>
                                        </div>
                                      </DialogHeader>
                                      <div className="p-6">
                                        {editingItem && renderSectionForm(currentSection, editingItem)}
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

// Helper Functions
function getItemTitle(item: AboutItem, type: AboutSection['type']): string {
  switch (type) {
    case 'hero':
      return item.title || 'Untitled Hero';
    case 'journey':
      return item.title || 'Our Journey';
    case 'owner':
      return item.name || 'Owner Details';
    case 'vision':
      return 'Vision & Mission';
    case 'values':
      return 'Core Values';
    case 'team':
      return item.title || 'Team Section';
    case 'achievements':
      return 'Key Achievements';
    default:
      return 'Untitled Item';
  }
}

function renderItemPreview(item: AboutItem, type: AboutSection['type']) {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-3">
          {item.backgroundImage && (
            <div className="relative overflow-hidden rounded-lg">
              <img src={item.backgroundImage} alt="" className="w-full h-24 xl:h-32 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-xs xl:text-sm font-semibold truncate">{item.subtitle}</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs xl:text-sm font-medium text-gray-700 truncate">{item.description}</p>
            {item.buttonText && (
              <span className="inline-flex items-center px-2 xl:px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {item.buttonText}
              </span>
            )}
          </div>
        </div>
      );
    case 'journey':
      return (
        <div className="space-y-3">
          <p className="text-xs xl:text-sm font-medium text-gray-700 line-clamp-3">{item.content}</p>
          {item.milestones && item.milestones.length > 0 && (
            <div className="text-xs text-gray-500">
              {item.milestones.length} milestone{item.milestones.length !== 1 ? 's' : ''} added
            </div>
          )}
        </div>
      );
    case 'owner':
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {item.image && (
              <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" />
            )}
            <div className="flex-1">
              <p className="text-xs xl:text-sm font-medium text-gray-700">{item.title}</p>
              <p className="text-xs text-gray-500">{item.experience}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{item.bio}</p>
        </div>
      );
    case 'vision':
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-blue-600 mb-1">Vision</p>
            <p className="text-xs text-gray-700 line-clamp-2">{item.vision}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-purple-600 mb-1">Mission</p>
            <p className="text-xs text-gray-700 line-clamp-2">{item.mission}</p>
          </div>
        </div>
      );
    case 'values':
      return (
        <div className="space-y-2">
          {item.values && item.values.slice(0, 3).map((value: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm">{value.icon}</span>
              <p className="text-xs font-medium text-gray-700 truncate">{value.title}</p>
            </div>
          ))}
          {item.values && item.values.length > 3 && (
            <p className="text-xs text-gray-500">+{item.values.length - 3} more values</p>
          )}
        </div>
      );
    case 'achievements':
      return (
        <div className="space-y-2">
          {item.achievements && item.achievements.slice(0, 3).map((achievement: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm">{achievement.icon}</span>
              <p className="text-xs font-medium text-gray-700 truncate">{achievement.title}</p>
            </div>
          ))}
          {item.achievements && item.achievements.length > 3 && (
            <p className="text-xs text-gray-500">+{item.achievements.length - 3} more achievements</p>
          )}
        </div>
      );
    default:
      return (
        <div className="text-xs text-gray-500 bg-gray-100 rounded p-3">
          <p className="font-medium mb-1">Preview data:</p>
          <p className="truncate">{JSON.stringify(item).slice(0, 60)}...</p>
        </div>
      );
  }
}

// Form Components
function HeroForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Main Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="About Excellence Academy"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-sm font-semibold text-gray-700">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Nurturing Dreams, Creating Success"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Brief description about your academy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundImage" className="text-sm font-semibold text-gray-700">Background Image URL</Label>
        <Input
          id="backgroundImage"
          value={formData.backgroundImage || ''}
          onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="https://example.com/about-hero.jpg"
        />
        {formData.backgroundImage && (
          <div className="mt-3">
            <img 
              src={formData.backgroundImage} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="buttonText" className="text-sm font-semibold text-gray-700">Button Text</Label>
          <Input
            id="buttonText"
            value={formData.buttonText || ''}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Learn More"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonLink" className="text-sm font-semibold text-gray-700">Button Link</Label>
          <Input
            id="buttonLink"
            value={formData.buttonLink || ''}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="#journey"
          />
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function JourneyForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addMilestone = () => {
    const newMilestone = { year: '', title: '', description: '' };
    setFormData({ 
      ...formData, 
      milestones: [...(formData.milestones || []), newMilestone] 
    });
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updatedMilestones = [...(formData.milestones || [])];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = formData.milestones?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Section Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Our Journey Since 2009"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-semibold text-gray-700">Journey Description</Label>
        <Textarea
          id="content"
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={5}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Tell the story of your academy's journey..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Milestones</Label>
          <Button type="button" onClick={addMilestone} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
        
        {formData.milestones?.map((milestone: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Milestone {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removeMilestone(index)}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Year</Label>
                <Input
                  value={milestone.year || ''}
                  onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                  placeholder="2009"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Title</Label>
                <Input
                  value={milestone.title || ''}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  placeholder="Foundation"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Description</Label>
                <Input
                  value={milestone.description || ''}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                  placeholder="Started with 20 students"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function OwnerForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addAchievement = () => {
    const achievements = formData.achievements || [];
    setFormData({ 
      ...formData, 
      achievements: [...achievements, ''] 
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const updatedAchievements = [...(formData.achievements || [])];
    updatedAchievements[index] = value;
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = formData.achievements?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Dr. Rajesh Sharma"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title/Position</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Founder & Director"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="qualification" className="text-sm font-semibold text-gray-700">Qualification</Label>
          <Input
            id="qualification"
            value={formData.qualification || ''}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Ph.D in Physics, IIT Delhi"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">Experience</Label>
          <Input
            id="experience"
            value={formData.experience || ''}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="20+ years in education"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Profile Image URL</Label>
        <Input
          id="image"
          value={formData.image || ''}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="https://example.com/profile-photo.jpg"
        />
        {formData.image && (
          <div className="mt-3">
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-24 h-24 object-cover rounded-full border border-gray-200"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Biography</Label>
        <Textarea
          id="bio"
          value={formData.bio || ''}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Professional background and achievements..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="philosophy" className="text-sm font-semibold text-gray-700">Philosophy/Quote</Label>
        <Textarea
          id="philosophy"
          value={formData.philosophy || ''}
          onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
          rows={2}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Educational philosophy or inspiring quote..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Key Achievements</Label>
          <Button type="button" onClick={addAchievement} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
        
        {formData.achievements?.map((achievement: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={achievement}
              onChange={(e) => updateAchievement(index, e.target.value)}
              placeholder="Achievement description"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => removeAchievement(index)}
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function VisionForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addGoal = () => {
    const goals = formData.goals || [];
    setFormData({ 
      ...formData, 
      goals: [...goals, ''] 
    });
  };

  const updateGoal = (index: number, value: string) => {
    const updatedGoals = [...(formData.goals || [])];
    updatedGoals[index] = value;
    setFormData({ ...formData, goals: updatedGoals });
  };

  const removeGoal = (index: number) => {
    const updatedGoals = formData.goals?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, goals: updatedGoals });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="vision" className="text-sm font-semibold text-gray-700">Vision Statement</Label>
        <Textarea
          id="vision"
          value={formData.vision || ''}
          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Our vision for the future..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mission" className="text-sm font-semibold text-gray-700">Mission Statement</Label>
        <Textarea
          id="mission"
          value={formData.mission || ''}
          onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
          rows={4}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Our mission and purpose..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Strategic Goals</Label>
          <Button type="button" onClick={addGoal} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
        
        {formData.goals?.map((goal: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={goal}
              onChange={(e) => updateGoal(index, e.target.value)}
              placeholder="Strategic goal description"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => removeGoal(index)}
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function ValuesForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addValue = () => {
    const values = formData.values || [];
    setFormData({ 
      ...formData, 
      values: [...values, { title: '', description: '', icon: '💡' }] 
    });
  };

  const updateValue = (index: number, field: string, value: string) => {
    const updatedValues = [...(formData.values || [])];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setFormData({ ...formData, values: updatedValues });
  };

  const removeValue = (index: number) => {
    const updatedValues = formData.values?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, values: updatedValues });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Core Values</Label>
          <Button type="button" onClick={addValue} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Value
          </Button>
        </div>
        
        {formData.values?.map((value: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Value {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removeValue(index)}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Icon (Emoji)</Label>
                <Input
                  value={value.icon || ''}
                  onChange={(e) => updateValue(index, 'icon', e.target.value)}
                  placeholder="🎯"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Title</Label>
                <Input
                  value={value.title || ''}
                  onChange={(e) => updateValue(index, 'title', e.target.value)}
                  placeholder="Excellence"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Description</Label>
                <Textarea
                  value={value.description || ''}
                  onChange={(e) => updateValue(index, 'description', e.target.value)}
                  placeholder="We strive for excellence..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function TeamForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Section Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Leadership Team"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Description of your team..."
        />
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function AchievementsForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addAchievement = () => {
    const achievements = formData.achievements || [];
    setFormData({ 
      ...formData, 
      achievements: [...achievements, { title: '', description: '', year: '', icon: '🏆' }] 
    });
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    const updatedAchievements = [...(formData.achievements || [])];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = formData.achievements?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Key Achievements</Label>
          <Button type="button" onClick={addAchievement} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
        
        {formData.achievements?.map((achievement: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Achievement {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removeAchievement(index)}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Icon (Emoji)</Label>
                <Input
                  value={achievement.icon || ''}
                  onChange={(e) => updateAchievement(index, 'icon', e.target.value)}
                  placeholder="🏆"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Year</Label>
                <Input
                  value={achievement.year || ''}
                  onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                  placeholder="2024"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Title</Label>
                <Input
                  value={achievement.title || ''}
                  onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                  placeholder="Best Institute Award"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Description</Label>
                <Textarea
                  value={achievement.description || ''}
                  onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                  placeholder="Description of the achievement..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function GenericForm({ item, onSave }: { item: AboutItem; onSave: (item: AboutItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Enter title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Enter description"
        />
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}