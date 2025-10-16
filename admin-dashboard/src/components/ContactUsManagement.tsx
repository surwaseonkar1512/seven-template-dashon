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
  Phone,
  MapPin,
  Mail,
  Clock,
  MessageSquare,
  Settings,
  Building,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TemplatePreview } from './TemplatePreview';

interface ContactItem {
  id: string;
  [key: string]: any;
}

interface ContactSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  order: number;
  items: ContactItem[];
  type: 'contact-details' | 'locations' | 'contact-form' | 'map' | 'social-media';
  color: string;
  bgColor: string;
}

// Draggable Section Component
function DraggableContactSection({
  section,
  index,
  isSelected,
  onSelect,
  onToggle,
  moveSection
}: {
  section: ContactSection;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTACT_SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CONTACT_SECTION',
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

export function ContactUsManagement() {
  const [selectedSection, setSelectedSection] = useState<string>('contact-details');
  const [editingItem, setEditingItem] = useState<ContactItem | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [sections, setSections] = useState<ContactSection[]>([
    {
      id: 'contact-details',
      name: 'Contact Details',
      icon: Phone,
      description: 'Primary contact information',
      enabled: true,
      order: 1,
      type: 'contact-details',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      items: [
        {
          id: '1',
          companyName: 'Excellence Academy',
          address: '123 Education Street, Knowledge City, State 123456',
          phone: '+91 98765 43210',
          alternatePhone: '+91 98765 43211',
          email: 'info@excellenceacademy.com',
          supportEmail: 'support@excellenceacademy.com',
          website: 'www.excellenceacademy.com',
          hours: 'Monday to Saturday: 9:00 AM - 6:00 PM',
          emergencyContact: '+91 98765 43212'
        }
      ]
    },
    {
      id: 'locations',
      name: 'Our Locations',
      icon: MapPin,
      description: 'Multiple branch locations',
      enabled: true,
      order: 2,
      type: 'locations',
      color: '#10b981',
      bgColor: '#d1fae5',
      items: [
        {
          id: '1',
          name: 'Main Campus',
          address: '123 Education Street, Knowledge City, State 123456',
          phone: '+91 98765 43210',
          email: 'main@excellenceacademy.com',
          coordinates: '28.6139, 77.2090',
          mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12...',
          timings: 'Mon-Sat: 9:00 AM - 6:00 PM',
          facilities: ['Library', 'Computer Lab', 'Cafeteria', 'Parking'],
          branchManager: 'Dr. Rajesh Kumar',
          established: '2009'
        },
        {
          id: '2',
          name: 'South Branch',
          address: '456 Learning Avenue, Education Hub, State 654321',
          phone: '+91 98765 43220',
          email: 'south@excellenceacademy.com',
          coordinates: '28.5355, 77.3910',
          mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12...',
          timings: 'Mon-Sat: 9:00 AM - 6:00 PM',
          facilities: ['Digital Classrooms', 'Testing Center', 'Parking'],
          branchManager: 'Prof. Priya Sharma',
          established: '2015'
        }
      ]
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      icon: MessageSquare,
      description: 'Inquiry form configuration',
      enabled: true,
      order: 3,
      type: 'contact-form',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      items: [
        {
          id: '1',
          title: 'Get in Touch',
          subtitle: 'We\'d love to hear from you',
          description: 'Send us a message and we\'ll respond as soon as possible.',
          fields: [
            { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
            { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter your phone number' },
            { name: 'course', label: 'Course Interest', type: 'select', required: false, options: ['IIT-JEE', 'NEET', 'Foundation', 'Other'] },
            { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us about your requirements' }
          ],
          submitButtonText: 'Send Message',
          successMessage: 'Thank you for your message! We\'ll get back to you soon.',
          autoReply: true,
          notificationEmail: 'admin@excellenceacademy.com'
        }
      ]
    },
    {
      id: 'map',
      name: 'Interactive Map',
      icon: Globe,
      description: 'Embedded map with locations',
      enabled: true,
      order: 4,
      type: 'map',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        {
          id: '1',
          title: 'Find Us',
          description: 'Locate our branches and get directions',
          defaultLocation: 'main',
          showAllLocations: true,
          mapStyle: 'roadmap',
          zoom: 12,
          markers: [
            {
              id: 'main',
              name: 'Main Campus',
              address: '123 Education Street, Knowledge City',
              coordinates: '28.6139, 77.2090',
              type: 'main'
            },
            {
              id: 'south',
              name: 'South Branch',
              address: '456 Learning Avenue, Education Hub',
              coordinates: '28.5355, 77.3910',
              type: 'branch'
            }
          ]
        }
      ]
    },
    {
      id: 'social-media',
      name: 'Social Media',
      icon: Building,
      description: 'Social media links and presence',
      enabled: false,
      order: 5,
      type: 'social-media',
      color: '#ef4444',
      bgColor: '#fee2e2',
      items: [
        {
          id: '1',
          title: 'Connect With Us',
          description: 'Follow us on social media for updates',
          platforms: [
            { name: 'Facebook', url: 'https://facebook.com/excellenceacademy', icon: 'facebook', followers: '25.6K' },
            { name: 'Instagram', url: 'https://instagram.com/excellenceacademy', icon: 'instagram', followers: '18.9K' },
            { name: 'YouTube', url: 'https://youtube.com/excellenceacademy', icon: 'youtube', followers: '45.2K' },
            { name: 'LinkedIn', url: 'https://linkedin.com/company/excellenceacademy', icon: 'linkedin', followers: '12.1K' },
            { name: 'Twitter', url: 'https://twitter.com/excellenceacademy', icon: 'twitter', followers: '8.5K' }
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

  const handleSaveItem = (sectionId: string, updatedItem: ContactItem) => {
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

  const createEmptyItem = (type: ContactSection['type']): ContactItem => {
    const id = Date.now().toString();
    
    switch (type) {
      case 'contact-details':
        return {
          id,
          companyName: '',
          address: '',
          phone: '',
          alternatePhone: '',
          email: '',
          supportEmail: '',
          website: '',
          hours: '',
          emergencyContact: ''
        };
      case 'locations':
        return {
          id,
          name: '',
          address: '',
          phone: '',
          email: '',
          coordinates: '',
          mapUrl: '',
          timings: '',
          facilities: [],
          branchManager: '',
          established: ''
        };
      case 'contact-form':
        return {
          id,
          title: '',
          subtitle: '',
          description: '',
          fields: [],
          submitButtonText: 'Submit',
          successMessage: '',
          autoReply: false,
          notificationEmail: ''
        };
      case 'map':
        return {
          id,
          title: '',
          description: '',
          defaultLocation: '',
          showAllLocations: true,
          mapStyle: 'roadmap',
          zoom: 12,
          markers: []
        };
      case 'social-media':
        return {
          id,
          title: '',
          description: '',
          platforms: []
        };
      default:
        return { id };
    }
  };

  const renderSectionForm = (section: ContactSection, item: ContactItem) => {
    switch (section.type) {
      case 'contact-details':
        return <ContactDetailsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'locations':
        return <LocationsForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'contact-form':
        return <ContactFormConfigForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'map':
        return <MapForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      case 'social-media':
        return <SocialMediaForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
      default:
        return <GenericForm item={item} onSave={(updatedItem) => handleSaveItem(section.id, updatedItem)} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Enhanced Sidebar */}
        <div className="w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl">
          <div className="p-6 xl:p-8 border-b border-gray-100 bg-gradient-to-r from-green-900 to-blue-800 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Contact Us Management</h2>
                <p className="text-sm text-gray-300">Manage contact page content</p>
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
                  <DraggableContactSection
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
              type="contact" 
              sections={sections.filter(s => s.enabled)} 
              title="Contact Us Page Preview"
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
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 xl:px-8 py-3 xl:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
function getItemTitle(item: ContactItem, type: ContactSection['type']): string {
  switch (type) {
    case 'contact-details':
      return item.companyName || 'Contact Details';
    case 'locations':
      return item.name || 'Location';
    case 'contact-form':
      return item.title || 'Contact Form';
    case 'map':
      return item.title || 'Interactive Map';
    case 'social-media':
      return item.title || 'Social Media';
    default:
      return 'Untitled Item';
  }
}

function renderItemPreview(item: ContactItem, type: ContactSection['type']) {
  switch (type) {
    case 'contact-details':
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-blue-500" />
            <p className="text-xs xl:text-sm font-medium text-gray-700">{item.phone}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-green-500" />
            <p className="text-xs xl:text-sm text-gray-600 truncate">{item.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <p className="text-xs text-gray-600 line-clamp-2">{item.address}</p>
          </div>
        </div>
      );
    case 'locations':
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-blue-500" />
            <p className="text-xs xl:text-sm font-medium text-gray-700">{item.branchManager}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-green-500" />
            <p className="text-xs xl:text-sm text-gray-600">{item.phone}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <p className="text-xs text-gray-600">{item.timings}</p>
          </div>
          {item.facilities && item.facilities.length > 0 && (
            <div className="text-xs text-gray-500">
              {item.facilities.length} facilities available
            </div>
          )}
        </div>
      );
    case 'contact-form':
      return (
        <div className="space-y-3">
          <p className="text-xs xl:text-sm font-medium text-gray-700 line-clamp-2">{item.description}</p>
          {item.fields && item.fields.length > 0 && (
            <div className="text-xs text-gray-500">
              {item.fields.length} form fields configured
            </div>
          )}
          {item.submitButtonText && (
            <span className="inline-flex items-center px-2 xl:px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              {item.submitButtonText}
            </span>
          )}
        </div>
      );
    case 'map':
      return (
        <div className="space-y-3">
          <p className="text-xs xl:text-sm font-medium text-gray-700 line-clamp-2">{item.description}</p>
          {item.markers && item.markers.length > 0 && (
            <div className="text-xs text-gray-500">
              {item.markers.length} location{item.markers.length !== 1 ? 's' : ''} marked
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-gray-600">Zoom level: {item.zoom}</p>
          </div>
        </div>
      );
    case 'social-media':
      return (
        <div className="space-y-3">
          <p className="text-xs xl:text-sm font-medium text-gray-700 line-clamp-2">{item.description}</p>
          {item.platforms && item.platforms.length > 0 && (
            <div className="space-y-1">
              {item.platforms.slice(0, 3).map((platform: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-700">{platform.name}</p>
                  <p className="text-xs text-gray-500">{platform.followers}</p>
                </div>
              ))}
              {item.platforms.length > 3 && (
                <p className="text-xs text-gray-500">+{item.platforms.length - 3} more platforms</p>
              )}
            </div>
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
function ContactDetailsForm({ item, onSave }: { item: ContactItem; onSave: (item: ContactItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">Company/Academy Name</Label>
        <Input
          id="companyName"
          value={formData.companyName || ''}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Excellence Academy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Complete address with city, state, postal code"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Primary Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alternatePhone" className="text-sm font-semibold text-gray-700">Alternate Phone</Label>
          <Input
            id="alternatePhone"
            value={formData.alternatePhone || ''}
            onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="+91 98765 43211"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Primary Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="info@excellenceacademy.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supportEmail" className="text-sm font-semibold text-gray-700">Support Email</Label>
          <Input
            id="supportEmail"
            type="email"
            value={formData.supportEmail || ''}
            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="support@excellenceacademy.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-semibold text-gray-700">Website</Label>
          <Input
            id="website"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="www.excellenceacademy.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContact" className="text-sm font-semibold text-gray-700">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact || ''}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="+91 98765 43212"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours" className="text-sm font-semibold text-gray-700">Business Hours</Label>
        <Input
          id="hours"
          value={formData.hours || ''}
          onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Monday to Saturday: 9:00 AM - 6:00 PM"
        />
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function LocationsForm({ item, onSave }: { item: ContactItem; onSave: (item: ContactItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addFacility = () => {
    const facilities = formData.facilities || [];
    setFormData({ 
      ...formData, 
      facilities: [...facilities, ''] 
    });
  };

  const updateFacility = (index: number, value: string) => {
    const updatedFacilities = [...(formData.facilities || [])];
    updatedFacilities[index] = value;
    setFormData({ ...formData, facilities: updatedFacilities });
  };

  const removeFacility = (index: number) => {
    const updatedFacilities = formData.facilities?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, facilities: updatedFacilities });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Branch Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Main Campus"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branchManager" className="text-sm font-semibold text-gray-700">Branch Manager</Label>
          <Input
            id="branchManager"
            value={formData.branchManager || ''}
            onChange={(e) => setFormData({ ...formData, branchManager: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Dr. Rajesh Kumar"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Complete address with landmarks"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Contact Number</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Branch Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="main@excellenceacademy.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="timings" className="text-sm font-semibold text-gray-700">Operating Hours</Label>
          <Input
            id="timings"
            value={formData.timings || ''}
            onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Mon-Sat: 9:00 AM - 6:00 PM"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="established" className="text-sm font-semibold text-gray-700">Established Year</Label>
          <Input
            id="established"
            value={formData.established || ''}
            onChange={(e) => setFormData({ ...formData, established: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="2009"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="coordinates" className="text-sm font-semibold text-gray-700">GPS Coordinates</Label>
          <Input
            id="coordinates"
            value={formData.coordinates || ''}
            onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="28.6139, 77.2090"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mapUrl" className="text-sm font-semibold text-gray-700">Google Maps Embed URL</Label>
          <Input
            id="mapUrl"
            value={formData.mapUrl || ''}
            onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="https://maps.google.com/embed?pb=..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Facilities Available</Label>
          <Button type="button" onClick={addFacility} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>
        
        {formData.facilities?.map((facility: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={facility}
              onChange={(e) => updateFacility(index, e.target.value)}
              placeholder="Library, Computer Lab, Cafeteria..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => removeFacility(index)}
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
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function ContactFormConfigForm({ item, onSave }: { item: ContactItem; onSave: (item: ContactItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Form Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Get in Touch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-sm font-semibold text-gray-700">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="We'd love to hear from you"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Form Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Brief description of the contact form"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="submitButtonText" className="text-sm font-semibold text-gray-700">Submit Button Text</Label>
          <Input
            id="submitButtonText"
            value={formData.submitButtonText || ''}
            onChange={(e) => setFormData({ ...formData, submitButtonText: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Send Message"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notificationEmail" className="text-sm font-semibold text-gray-700">Notification Email</Label>
          <Input
            id="notificationEmail"
            type="email"
            value={formData.notificationEmail || ''}
            onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="admin@excellenceacademy.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="successMessage" className="text-sm font-semibold text-gray-700">Success Message</Label>
        <Textarea
          id="successMessage"
          value={formData.successMessage || ''}
          onChange={(e) => setFormData({ ...formData, successMessage: e.target.value })}
          rows={2}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Thank you for your message! We'll get back to you soon."
        />
      </div>

      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Switch
          id="autoReply"
          checked={formData.autoReply || false}
          onCheckedChange={(checked) => setFormData({ ...formData, autoReply: checked })}
        />
        <Label htmlFor="autoReply" className="text-sm font-semibold text-gray-700">
          Send Auto-Reply Email
        </Label>
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function MapForm({ item, onSave }: { item: ContactItem; onSave: (item: ContactItem) => void }) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Map Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Find Us"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zoom" className="text-sm font-semibold text-gray-700">Zoom Level (1-20)</Label>
          <Input
            id="zoom"
            type="number"
            min="1"
            max="20"
            value={formData.zoom || 12}
            onChange={(e) => setFormData({ ...formData, zoom: parseInt(e.target.value) })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          placeholder="Description for the interactive map"
        />
      </div>

      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <Switch
          id="showAllLocations"
          checked={formData.showAllLocations || false}
          onCheckedChange={(checked) => setFormData({ ...formData, showAllLocations: checked })}
        />
        <Label htmlFor="showAllLocations" className="text-sm font-semibold text-gray-700">
          Show All Branch Locations
        </Label>
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-6 py-2 border-gray-300 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function SocialMediaForm({ item, onSave }: { item: ContactItem; onSave: (item: ContactItem) => void }) {
  const [formData, setFormData] = useState(item);

  const addPlatform = () => {
    const platforms = formData.platforms || [];
    setFormData({ 
      ...formData, 
      platforms: [...platforms, { name: '', url: '', icon: '', followers: '' }] 
    });
  };

  const updatePlatform = (index: number, field: string, value: string) => {
    const updatedPlatforms = [...(formData.platforms || [])];
    updatedPlatforms[index] = { ...updatedPlatforms[index], [field]: value };
    setFormData({ ...formData, platforms: updatedPlatforms });
  };

  const removePlatform = (index: number) => {
    const updatedPlatforms = formData.platforms?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, platforms: updatedPlatforms });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Section Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Connect With Us"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
          <Input
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Follow us on social media"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">Social Media Platforms</Label>
          <Button type="button" onClick={addPlatform} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Platform
          </Button>
        </div>
        
        {formData.platforms?.map((platform: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Platform {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removePlatform(index)}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Platform Name</Label>
                <Input
                  value={platform.name || ''}
                  onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                  placeholder="Facebook"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">URL</Label>
                <Input
                  value={platform.url || ''}
                  onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Icon (lowercase)</Label>
                <Input
                  value={platform.icon || ''}
                  onChange={(e) => updatePlatform(index, 'icon', e.target.value)}
                  placeholder="facebook"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Followers</Label>
                <Input
                  value={platform.followers || ''}
                  onChange={(e) => updatePlatform(index, 'followers', e.target.value)}
                  placeholder="25.6K"
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
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function GenericForm({ item, onSave }: { item: ContactItem; onSave: (item: ContactItem) => void }) {
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
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}