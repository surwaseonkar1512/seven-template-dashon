import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Eye, 
  ExternalLink,
  Palette,
  Layout,
  Star,
  Users,
  Award,
  Camera,
  TrendingUp,
  Target,
  Trophy,
  UserCheck,
  MessageSquare,
  BookOpen,
  Video,
  Calendar,
  HelpCircle,
  Phone,
  Sparkles,
  ChevronDown,
  Maximize2,
  Minimize2,
  LayoutDashboard,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: 'modern' | 'classic' | 'minimal' | 'professional';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  featured?: boolean;
  popularity?: number;
}

const templates: Template[] = [
  {
    id: 'modern-education',
    name: 'Modern Education Hub',
    description: 'Clean, contemporary design perfect for coaching institutes',
    category: 'Educational',
    theme: 'modern',
    colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
    featured: true,
    popularity: 95
  },
  {
    id: 'classic-academy',
    name: 'Classic Academy Pro',
    description: 'Traditional academic layout with professional appeal',
    category: 'Educational',
    theme: 'classic',
    colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
    featured: true,
    popularity: 88
  },
  {
    id: 'minimal-focus',
    name: 'Minimal Focus',
    description: 'Minimalist design emphasizing content and clarity',
    category: 'Educational',
    theme: 'minimal',
    colors: { primary: '#6b7280', secondary: '#374151', accent: '#9ca3af' },
    popularity: 82
  },
  {
    id: 'professional-elite',
    name: 'Professional Elite',
    description: 'Premium professional template for top-tier institutes',
    category: 'Educational',
    theme: 'professional',
    colors: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#8b5cf6' },
    featured: true,
    popularity: 91
  },
  {
    id: 'achievement-showcase',
    name: 'Achievement Showcase',
    description: 'Specially designed to highlight student achievements',
    category: 'Achievement',
    theme: 'modern',
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
    popularity: 79
  },
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    description: 'Modern tech-focused design for digital learning',
    category: 'Technology',
    theme: 'modern',
    colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' },
    popularity: 85
  }
];

export function TemplatePreviewTab() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-education');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewType, setPreviewType] = useState<'homepage' | 'about' | 'contact' | 'achievements'>('homepage');

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  const renderPreviewContent = () => {
    switch (previewType) {
      case 'homepage':
        return <HomepagePreview template={currentTemplate} />;
      case 'about':
        return <AboutPreview template={currentTemplate} />;
      case 'contact':
        return <ContactPreview template={currentTemplate} />;
      case 'achievements':
        return <AchievementPreview template={currentTemplate} />;
      default:
        return <HomepagePreview template={currentTemplate} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Template Preview</h1>
                  <p className="text-sm text-gray-600 mt-1">Live preview of coaching institute websites</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs px-4 py-2 font-medium">
                Live Preview Mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-8">
              {/* Template Selector */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Layout className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Template:</span>
                </div>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-96 bg-white border-gray-300 hover:border-gray-400 transition-colors shadow-sm">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="max-w-md">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="p-4">
                        <div className="flex items-center space-x-4 w-full">
                          <div 
                            className="w-6 h-6 rounded-lg border-2 border-white shadow-sm"
                            style={{ backgroundColor: template.colors.primary }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{template.name}</p>
                              {template.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs px-2 py-0.5"
                                style={{ borderColor: template.colors.primary, color: template.colors.primary }}
                              >
                                {template.category}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-gray-500">{template.popularity}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-10" />

              {/* Page Type Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Page:</span>
                <div className="flex space-x-1 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                  {[
                    { id: 'homepage', label: 'Home', icon: LayoutDashboard },
                    { id: 'about', label: 'About', icon: Info },
                    { id: 'contact', label: 'Contact', icon: Phone },
                    { id: 'achievements', label: 'Awards', icon: Trophy }
                  ].map((page) => {
                    const Icon = page.icon;
                    return (
                      <Button
                        key={page.id}
                        variant={previewType === page.id ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewType(page.id as any)}
                        className={`h-9 px-4 text-xs transition-all duration-200 ${
                          previewType === page.id 
                            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {page.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Responsive Controls */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex items-center space-x-1 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className={`h-9 px-5 transition-all duration-200 ${
                    viewMode === 'desktop' 
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className={`h-9 px-5 transition-all duration-200 ${
                    viewMode === 'mobile' 
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        <div className="h-full flex items-center justify-center p-6">
          <motion.div
            key={`${viewMode}-${selectedTemplate}-${previewType}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`
              bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden
              ${viewMode === 'desktop' 
                ? 'w-full max-w-7xl h-full' 
                : 'w-96 h-[700px]'
              }
              ${isFullscreen ? 'fixed inset-6 z-50 max-w-none rounded-2xl' : ''}
            `}
          >
            {/* Browser/Mobile Frame */}
            <div 
              className={`flex items-center px-6 py-4 border-b ${
                viewMode === 'desktop' ? 'bg-gray-50' : 'bg-white'
              }`}
              style={{ backgroundColor: `${currentTemplate.colors.primary}08` }}
            >
              {viewMode === 'desktop' ? (
                <>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div 
                    className="flex-1 mx-6 px-4 py-2 text-sm text-center rounded-lg font-medium"
                    style={{ backgroundColor: `${currentTemplate.colors.primary}15`, color: currentTemplate.colors.primary }}
                  >
                    www.excellenceacademy.com/{previewType}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {currentTemplate.theme}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-600">Mobile View</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className={`
              overflow-y-auto h-full bg-white
              ${viewMode === 'mobile' ? 'text-sm' : ''}
            `}>
              {renderPreviewContent()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Template Info Panel (if not fullscreen) */}
      {!isFullscreen && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: currentTemplate.colors.primary }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{currentTemplate.name}</h3>
                  <p className="text-xs text-gray-600">{currentTemplate.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="text-xs">
                  {currentTemplate.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">{currentTemplate.popularity}% Popular</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: currentTemplate.colors.primary }}
                />
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: currentTemplate.colors.secondary }}
                />
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: currentTemplate.colors.accent }}
                />
              </div>
              <span className="text-xs text-gray-500 ml-2">Color Palette</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preview Components for different page types
function HomepagePreview({ template }: { template: Template }) {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-6 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl mb-6 font-bold"
          >
            Excellence Academy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Your Success, Our Mission - Join thousands of successful students
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              Get Started Today
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6" style={{ backgroundColor: `${template.colors.primary}05` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Students Trained', value: '10,000+', icon: Users },
              { label: 'Success Rate', value: '95%', icon: TrendingUp },
              { label: 'Expert Faculty', value: '50+', icon: UserCheck },
              { label: 'Years Experience', value: '15+', icon: Award }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: template.colors.accent }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: template.colors.primary }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl text-center mb-12 font-bold" 
            style={{ color: template.colors.primary }}
          >
            Our Premium Courses
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['JEE Main & Advanced', 'NEET Preparation', 'Foundation Course'].map((course, index) => (
              <motion.div
                key={course}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div 
                      className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
                      style={{ backgroundColor: template.colors.accent }}
                    >
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl mb-3 font-semibold">{course}</h3>
                    <p className="text-gray-600 mb-6">
                      Comprehensive preparation with expert faculty and proven methodology for guaranteed success.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      style={{ borderColor: template.colors.primary, color: template.colors.primary }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6" style={{ backgroundColor: `${template.colors.primary}05` }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl text-center mb-12 font-bold" 
            style={{ color: template.colors.primary }}
          >
            Student Success Stories
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: 'Rahul Kumar', rank: 'AIR 1', exam: 'JEE Advanced 2024' },
              { name: 'Priya Sharma', rank: 'AIR 15', exam: 'NEET 2024' }
            ].map((student, index) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: template.colors.accent }}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{student.name}</h4>
                      <Badge 
                        className="mb-3"
                        style={{ backgroundColor: template.colors.primary }}
                      >
                        {student.rank}
                      </Badge>
                      <p className="text-gray-600">
                        "The guidance and support I received here was exceptional. 
                        The faculty truly cares about student success and goes above and beyond."
                      </p>
                      <p className="text-sm text-gray-500 mt-2">{student.exam}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer 
        className="py-16 px-6 text-white text-center"
        style={{ backgroundColor: template.colors.secondary }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl mb-6 font-bold"
          >
            Ready to Start Your Success Journey?
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Contact us today for more information and begin your path to excellence
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center space-x-8"
          >
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>info@excellenceacademy.com</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function AboutPreview({ template }: { template: Template }) {
  return (
    <div className="space-y-0">
      <section 
        className="py-20 px-6 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-6 font-bold">About Excellence Academy</h1>
          <p className="text-xl opacity-90">
            Empowering students to achieve their dreams through quality education and guidance
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl mb-4 font-bold" style={{ color: template.colors.primary }}>Our Mission</h2>
            <p className="text-gray-600">
              To provide comprehensive, innovative, and personalized education that prepares 
              students for competitive examinations while fostering critical thinking and lifelong learning.
            </p>
          </Card>
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl mb-4 font-bold" style={{ color: template.colors.primary }}>Our Vision</h2>
            <p className="text-gray-600">
              To be the leading educational institution that transforms aspirations into achievements, 
              creating future leaders and innovators who contribute positively to society.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

function ContactPreview({ template }: { template: Template }) {
  return (
    <div className="space-y-0">
      <section 
        className="py-20 px-6 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Phone className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl mb-6 font-bold">Contact Us</h1>
          <p className="text-xl opacity-90">
            Get in touch with us to start your journey to success
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl mb-8 font-bold" style={{ color: template.colors.primary }}>
              Get In Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: template.colors.accent }}
                >
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          <Card className="p-8">
            <h3 className="text-xl mb-4 font-semibold">Send us a message</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full p-3 border rounded-lg"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-3 border rounded-lg"
              />
              <textarea 
                placeholder="Your Message" 
                rows={4}
                className="w-full p-3 border rounded-lg"
              />
              <Button 
                className="w-full"
                style={{ backgroundColor: template.colors.primary }}
              >
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function AchievementPreview({ template }: { template: Template }) {
  return (
    <div className="space-y-0">
      <section 
        className="relative py-20 px-6 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Trophy className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl mb-6 font-bold">
            Achievements 2024
          </h1>
          <p className="text-xl mb-8 opacity-90">
            A Year of Excellence and Outstanding Success Stories
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12 font-bold" style={{ color: template.colors.primary }}>
            Top Rankers 2024
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Arjun Sharma - AIR 1', 'Priya Patel - AIR 3', 'Rohit Kumar - AIR 7'].map((ranker, index) => (
              <Card key={ranker} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${template.colors.accent}40` }}
                >
                  <Star className="h-10 w-10" style={{ color: template.colors.primary }} />
                </div>
                <h3 className="text-xl mb-2 font-semibold">{ranker.split(' - ')[0]}</h3>
                <Badge 
                  className="mb-4"
                  style={{ backgroundColor: template.colors.primary }}
                >
                  {ranker.split(' - ')[1]}
                </Badge>
                <p className="text-gray-600">JEE Advanced 2024</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}