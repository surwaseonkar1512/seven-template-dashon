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
  Image as ImageIcon,
  Video,
  Users,
  Award,
  BookOpen,
  MessageSquare,
  Calendar,
  Star,
  Camera,
  HelpCircle,
  Phone,
  Megaphone,
  PenTool,
  Settings,
  Sparkles,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TemplatePreview } from './TemplatePreview';

interface SectionItem {
  id: string;
  [key: string]: any;
}

interface Section {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  order: number;
  items: SectionItem[];
  type: 'hero' | 'about' | 'courses' | 'faculty' | 'testimonials' | 'achievements' | 
        'student-achievements' | 'demo-lectures' | 'upcoming-batches' | 'success-stories' | 
        'gallery' | 'faq' | 'contact' | 'cta' | 'blog';
  color: string;
  bgColor: string;
}

// Draggable Section Component
function DraggableSection({
  section,
  index,
  isSelected,
  onSelect,
  onToggle,
  moveSection
}: {
  section: Section;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SECTION',
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

export function SectionManagement() {
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [sections, setSections] = useState<Section[]>([
    {
      id: 'hero',
      name: 'Hero Section',
      icon: Sparkles,
      description: 'Main banner with hero content',
      enabled: true,
      order: 1,
      type: 'hero',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      items: [
        {
          id: '1',
          title: 'Welcome to Excellence Academy',
          subtitle: 'Your Success, Our Mission',
          description: 'Join thousands of successful students who achieved their dreams with our expert guidance.',
          backgroundImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
          buttonText: 'Get Started Today',
          buttonLink: '#contact',
          overlayOpacity: 0.6
        }
      ]
    },
    {
      id: 'about',
      name: 'About Institute',
      icon: Shield,
      description: 'Institute information and history',
      enabled: true,
      order: 2,
      type: 'about',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      items: [
        {
          id: '1',
          title: 'About Excellence Academy',
          content: 'With over 15 years of experience in competitive exam preparation, we have guided thousands of students to success.',
          image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop',
          stats: [
            { label: 'Years of Experience', value: '15+' },
            { label: 'Students Placed', value: '10,000+' },
            { label: 'Success Rate', value: '95%' },
            { label: 'Expert Faculty', value: '50+' }
          ]
        }
      ]
    },
    {
      id: 'courses',
      name: 'Courses Offered',
      icon: BookOpen,
      description: 'Available courses and programs',
      enabled: true,
      order: 3,
      type: 'courses',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        {
          id: '1',
          name: 'IIT-JEE Main & Advanced',
          description: 'Comprehensive preparation for engineering entrance exams',
          duration: '2 Years',
          price: '₹2,50,000',
          features: ['Live Classes', 'Study Material', 'Mock Tests', 'Doubt Sessions'],
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
          popular: true
        }
      ]
    },
    {
      id: 'faculty',
      name: 'Faculty',
      icon: Users,
      description: 'Expert teaching staff',
      enabled: true,
      order: 4,
      type: 'faculty',
      color: '#ef4444',
      bgColor: '#fee2e2',
      items: [
        {
          id: '1',
          name: 'Dr. Rajesh Kumar',
          subject: 'Physics',
          experience: '15 years',
          qualification: 'Ph.D in Physics, IIT Delhi',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
          bio: 'Expert in conceptual physics with a track record of producing top rankers.',
          achievements: ['Best Teacher Award 2023', '500+ Students in Top 100']
        }
      ]
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      icon: MessageSquare,
      description: 'Student and parent feedback',
      enabled: false,
      order: 5,
      type: 'testimonials',
      color: '#10b981',
      bgColor: '#d1fae5',
      items: [
        {
          id: '1',
          name: 'Arjun Patel',
          role: 'IIT-JEE Topper 2024',
          content: 'Excellence Academy transformed my preparation strategy. The faculty\'s guidance helped me achieve AIR 15.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
          rating: 5,
          exam: 'IIT-JEE',
          rank: 'AIR 15'
        }
      ]
    },
    {
      id: 'achievements',
      name: 'Achievements',
      icon: Award,
      description: 'Institute accomplishments',
      enabled: true,
      order: 6,
      type: 'achievements',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        {
          id: '1',
          title: 'Best Coaching Institute 2024',
          description: 'Awarded by Education Excellence Board',
          year: '2024',
          image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop',
          category: 'Industry Recognition'
        }
      ]
    },
    {
      id: 'student-achievements',
      name: 'Student Achievements',
      icon: TrendingUp,
      description: 'Notable student successes',
      enabled: false,
      order: 7,
      type: 'student-achievements',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      items: [
        {
          id: '1',
          studentName: 'Rohit Verma',
          achievement: 'AIR 1 in JEE Advanced 2024',
          exam: 'IIT-JEE',
          year: '2024',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
          college: 'IIT Bombay',
          branch: 'Computer Science'
        }
      ]
    },
    {
      id: 'demo-lectures',
      name: 'Demo Lectures',
      icon: Video,
      description: 'Free trial classes',
      enabled: true,
      order: 8,
      type: 'demo-lectures',
      color: '#ef4444',
      bgColor: '#fee2e2',
      items: [
        {
          id: '1',
          title: 'Physics - Wave Motion',
          instructor: 'Dr. Rajesh Kumar',
          duration: '45 minutes',
          subject: 'Physics',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
          description: 'Understanding wave motion concepts with practical examples'
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

  const handleSaveItem = (sectionId: string, updatedItem: SectionItem) => {
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

  const createEmptyItem = (type: Section['type']): SectionItem => {
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
          buttonLink: '',
          overlayOpacity: 0.5
        };
      case 'about':
        return {
          id,
          title: '',
          content: '',
          image: '',
          stats: []
        };
      case 'courses':
        return {
          id,
          name: '',
          description: '',
          duration: '',
          price: '',
          features: [],
          image: '',
          popular: false
        };
      case 'faculty':
        return {
          id,
          name: '',
          subject: '',
          experience: '',
          qualification: '',
          image: '',
          bio: '',
          achievements: []
        };
      case 'testimonials':
        return {
          id,
          name: '',
          role: '',
          content: '',
          image: '',
          rating: 5,
          exam: '',
          rank: ''
        };
      default:
        return { id };
    }
  };

  const renderSectionForm = (section: Section, item: SectionItem) => {
    switch (section.type) {
      case 'hero':
        return <HeroForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'about':
        return <AboutForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'courses':
        return <CoursesForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'faculty':
        return <FacultyForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'testimonials':
        return <TestimonialsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      default:
        return <GenericForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Enhanced Sidebar - Optimized for 1200px */}
        <div className="w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl">
          <div className="p-6 xl:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Section Management</h2>
                <p className="text-sm text-gray-300">Manage homepage sections</p>
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
                  <DraggableSection
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
              type="homepage" 
              sections={sections.filter(s => s.enabled)} 
              title="Homepage Preview"
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
                    <h4 className="text-xl xl:text-2xl font-bold text-gray-900 mb-3">No items in this section</h4>
                    <p className="text-gray-600 mb-8 max-w-md text-sm xl:text-base">
                      Start building your {currentSection.name.toLowerCase()} by adding your first item. 
                      You can customize content, images, and styling.
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
                                              Modify the content and styling for this section item
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
function getItemTitle(item: SectionItem, type: Section['type']): string {
  switch (type) {
    case 'hero':
      return item.title || 'Untitled Hero';
    case 'about':
      return item.title || 'About Section';
    case 'courses':
      return item.name || 'Untitled Course';
    case 'faculty':
      return item.name || 'Faculty Member';
    case 'testimonials':
      return item.name || 'Student Testimonial';
    default:
      return 'Untitled Item';
  }
}

function renderItemPreview(item: SectionItem, type: Section['type']) {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-3 xl:space-y-4">
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
    case 'courses':
      return (
        <div className="space-y-3 xl:space-y-4">
          {item.image && (
            <img src={item.image} alt="" className="w-full h-24 xl:h-32 object-cover rounded-lg" />
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs xl:text-sm font-medium text-gray-700">{item.duration}</span>
              <span className="text-xs xl:text-sm font-bold text-green-600">{item.price}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{item.description}</p>
            {item.popular && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                ⭐ Popular
              </span>
            )}
          </div>
        </div>
      );
    case 'faculty':
      return (
        <div className="space-y-3 xl:space-y-4">
          <div className="flex items-center space-x-3">
            {item.image && (
              <img src={item.image} alt="" className="w-10 h-10 xl:w-12 xl:h-12 object-cover rounded-full border-2 border-gray-200" />
            )}
            <div className="flex-1">
              <p className="text-xs xl:text-sm font-medium text-gray-700">{item.subject}</p>
              <p className="text-xs text-gray-500">{item.experience}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 truncate">{item.qualification}</p>
        </div>
      );
    case 'testimonials':
      return (
        <div className="space-y-3 xl:space-y-4">
          <div className="flex items-center space-x-3">
            {item.image && (
              <img src={item.image} alt="" className="w-8 h-8 xl:w-10 xl:h-10 object-cover rounded-full" />
            )}
            <div className="flex-1">
              <p className="text-xs xl:text-sm font-medium text-gray-700">{item.role}</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{item.content}</p>
          {item.rank && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              {item.rank}
            </span>
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
function HeroForm({ item, onSave }: { item: SectionItem; onSave: (item: SectionItem) => void }) {
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
            placeholder="Enter compelling main title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-sm font-semibold text-gray-700">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Supporting subtitle text"
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
          placeholder="Describe what makes your academy special"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundImage" className="text-sm font-semibold text-gray-700">Background Image URL</Label>
        <Input
          id="backgroundImage"
          value={formData.backgroundImage || ''}
          onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="https://example.com/hero-image.jpg"
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
            placeholder="Call to action text"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonLink" className="text-sm font-semibold text-gray-700">Button Link</Label>
          <Input
            id="buttonLink"
            value={formData.buttonLink || ''}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="#contact or /signup"
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

function AboutForm({ item, onSave }: { item: SectionItem; onSave: (item: SectionItem) => void }) {
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
          placeholder="About Our Academy"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-semibold text-gray-700">Content</Label>
        <Textarea
          id="content"
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={5}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Tell your academy's story, mission, and achievements..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Image URL</Label>
        <Input
          id="image"
          value={formData.image || ''}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="https://example.com/about-image.jpg"
        />
        {formData.image && (
          <div className="mt-3">
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
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

function CoursesForm({ item, onSave }: { item: SectionItem; onSave: (item: SectionItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Course Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="IIT-JEE Main & Advanced"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-semibold text-gray-700">Duration</Label>
          <Input
            id="duration"
            value={formData.duration || ''}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="2 Years"
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
          placeholder="Comprehensive course description and benefits..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price</Label>
          <Input
            id="price"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="₹2,50,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Course Image URL</Label>
          <Input
            id="image"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="https://example.com/course-image.jpg"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <Switch
          id="popular"
          checked={formData.popular || false}
          onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
        />
        <Label htmlFor="popular" className="text-sm font-semibold text-gray-700">
          Mark as Popular Course
        </Label>
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

function FacultyForm({ item, onSave }: { item: SectionItem; onSave: (item: SectionItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Faculty Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Dr. Rajesh Kumar"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</Label>
          <Input
            id="subject"
            value={formData.subject || ''}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Physics"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">Experience</Label>
          <Input
            id="experience"
            value={formData.experience || ''}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="15 years"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Profile Image URL</Label>
          <Input
            id="image"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="https://example.com/faculty-photo.jpg"
          />
        </div>
      </div>

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
        <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio || ''}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Faculty bio, expertise, and teaching philosophy..."
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

function TestimonialsForm({ item, onSave }: { item: SectionItem; onSave: (item: SectionItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Student Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Arjun Patel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-semibold text-gray-700">Role/Achievement</Label>
          <Input
            id="role"
            value={formData.role || ''}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="IIT-JEE Topper 2024"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-semibold text-gray-700">Testimonial Content</Label>
        <Textarea
          id="content"
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Student's testimonial about their experience..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="exam" className="text-sm font-semibold text-gray-700">Exam</Label>
          <Input
            id="exam"
            value={formData.exam || ''}
            onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="IIT-JEE"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rank" className="text-sm font-semibold text-gray-700">Rank/Result</Label>
          <Input
            id="rank"
            value={formData.rank || ''}
            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="AIR 15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Student Photo URL</Label>
          <Input
            id="image"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="https://example.com/student-photo.jpg"
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

function GenericForm({ item, onSave }: { item: SectionItem; onSave: (item: SectionItem) => void }) {
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