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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TemplatePreviewProps {
  type: 'homepage' | 'achievements' | 'about' | 'contact';
  sections?: any[];
  title?: string;
}

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
  preview: string;
}

const templates: Template[] = [
  {
    id: 'modern-education',
    name: 'Modern Education',
    description: 'Clean, contemporary design perfect for coaching institutes',
    category: 'Educational',
    theme: 'modern',
    colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
    preview: '/api/placeholder/800/600'
  },
  {
    id: 'classic-academy',
    name: 'Classic Academy',
    description: 'Traditional academic layout with professional appeal',
    category: 'Educational',
    theme: 'classic',
    colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
    preview: '/api/placeholder/800/600'
  },
  {
    id: 'minimal-focus',
    name: 'Minimal Focus',
    description: 'Minimalist design emphasizing content and clarity',
    category: 'Educational',
    theme: 'minimal',
    colors: { primary: '#6b7280', secondary: '#374151', accent: '#9ca3af' },
    preview: '/api/placeholder/800/600'
  },
  {
    id: 'professional-elite',
    name: 'Professional Elite',
    description: 'Premium professional template for top-tier institutes',
    category: 'Educational',
    theme: 'professional',
    colors: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#8b5cf6' },
    preview: '/api/placeholder/800/600'
  },
  {
    id: 'achievement-showcase',
    name: 'Achievement Showcase',
    description: 'Specially designed to highlight student achievements',
    category: 'Achievement',
    theme: 'modern',
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
    preview: '/api/placeholder/800/600'
  }
];

export function TemplatePreview({ type, sections = [], title = "Website Preview" }: TemplatePreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-education');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  const getRelevantTemplates = () => {
    return templates.filter(template => 
      type === 'achievements' 
        ? template.category === 'Achievement' || template.theme === 'modern'
        : template.category === 'Educational'
    );
  };

  const renderPreviewContent = () => {
    switch (type) {
      case 'homepage':
        return <HomepagePreview template={currentTemplate} sections={sections} />;
      case 'achievements':
        return <AchievementPreview template={currentTemplate} sections={sections} />;
      case 'about':
        return <AboutPreview template={currentTemplate} sections={sections} />;
      case 'contact':
        return <ContactPreview template={currentTemplate} sections={sections} />;
      default:
        return <HomepagePreview template={currentTemplate} sections={sections} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Live preview of your website</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Template Selection and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Template Selector */}
            <div className="flex items-center space-x-2">
              <Layout className="h-4 w-4 text-gray-500" />
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {getRelevantTemplates().map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: template.colors.primary }}
                        />
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Info */}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {currentTemplate.category}
              </Badge>
              <Badge 
                variant="secondary" 
                className="text-xs capitalize"
                style={{ 
                  backgroundColor: `${currentTemplate.colors.primary}20`,
                  color: currentTemplate.colors.primary
                }}
              >
                {currentTemplate.theme}
              </Badge>
            </div>
          </div>

          {/* Responsive Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className={`h-8 px-3 transition-all duration-200 ${
                viewMode === 'desktop' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className={`h-8 px-3 transition-all duration-200 ${
                viewMode === 'mobile' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
          <motion.div
            key={`${viewMode}-${selectedTemplate}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`
              bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden
              ${viewMode === 'desktop' 
                ? 'w-full max-w-7xl h-full' 
                : 'w-80 h-[600px] mx-auto'
              }
              ${isFullscreen ? 'fixed inset-4 z-50 max-w-none' : ''}
            `}
          >
            {/* Browser/Mobile Frame */}
            <div 
              className="flex items-center space-x-2 px-4 py-3 border-b"
              style={{ backgroundColor: `${currentTemplate.colors.primary}10` }}
            >
              {viewMode === 'desktop' ? (
                <>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div 
                    className="flex-1 mx-4 px-3 py-1 text-sm text-center rounded-md"
                    style={{ backgroundColor: `${currentTemplate.colors.primary}20` }}
                  >
                    www.yourcoachingsite.com
                  </div>
                </>
              ) : (
                <div className="flex-1 flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className={`
              overflow-y-auto h-full
              ${viewMode === 'mobile' ? 'text-sm' : ''}
            `}>
              {renderPreviewContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Preview Components for different page types
function HomepagePreview({ template, sections }: { template: Template; sections: any[] }) {
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
          <h1 className="text-4xl md:text-6xl mb-6">
            Welcome to Excellence Academy
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Your Success, Our Mission - Join thousands of successful students
          </p>
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl mb-6" style={{ color: template.colors.primary }}>
              About Excellence Academy
            </h2>
            <p className="text-gray-600 mb-6">
              With over 15 years of experience in competitive exam preparation, 
              we have helped thousands of students achieve their dreams.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: template.colors.primary }}>
                  10,000+
                </div>
                <div className="text-sm text-gray-600">Students Trained</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: template.colors.primary }}>
                  95%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
          <div 
            className="h-64 rounded-lg"
            style={{ backgroundColor: `${template.colors.accent}40` }}
          >
            <div className="h-full flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-6" style={{ backgroundColor: `${template.colors.primary}05` }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12" style={{ color: template.colors.primary }}>
            Our Courses
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['JEE Main & Advanced', 'NEET Preparation', 'Foundation Course'].map((course, index) => (
              <Card key={course} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div 
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: template.colors.accent }}
                  >
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl mb-3">{course}</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive preparation with expert faculty and proven methodology.
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
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12" style={{ color: template.colors.primary }}>
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {['Rahul Kumar - AIR 1', 'Priya Sharma - AIR 15'].map((student, index) => (
              <Card key={student} className="p-6">
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: template.colors.accent }}
                  >
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{student}</h4>
                    <p className="text-gray-600">
                      "The guidance and support I received here was exceptional. 
                      The faculty truly cares about student success."
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer 
        className="py-12 px-6 text-white"
        style={{ backgroundColor: template.colors.secondary }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl mb-4">Ready to Start Your Journey?</h3>
          <p className="mb-6 opacity-90">Contact us today for more information</p>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AchievementPreview({ template, sections }: { template: Template; sections: any[] }) {
  return (
    <div className="space-y-0">
      {/* Achievement Hero */}
      <section 
        className="relative py-20 px-6 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Trophy className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl mb-6">
            Achievements 2024
          </h1>
          <p className="text-xl mb-8 opacity-90">
            A Year of Excellence and Outstanding Success Stories
          </p>
        </div>
      </section>

      {/* Top Rankers */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12" style={{ color: template.colors.primary }}>
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
                <h3 className="text-xl mb-2">{ranker.split(' - ')[0]}</h3>
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

      {/* Performance Stats */}
      <section className="py-16 px-6" style={{ backgroundColor: `${template.colors.primary}05` }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12" style={{ color: template.colors.primary }}>
            Performance Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Students Qualified', value: '1,250', icon: Users },
              { label: 'Top 100 Ranks', value: '156', icon: Trophy },
              { label: 'Success Rate', value: '95%', icon: TrendingUp },
              { label: 'IIT Selections', value: '340', icon: Award }
            ].map((stat, index) => (
              <Card key={stat.label} className="text-center p-6">
                <div 
                  className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: template.colors.accent }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: template.colors.primary }}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12" style={{ color: template.colors.primary }}>
            Awards & Recognition
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Best Coaching Institute 2024',
              'Excellence in Education Award'
            ].map((award, index) => (
              <Card key={award} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: template.colors.accent }}
                  >
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">{award}</h3>
                    <p className="text-gray-600">Recognized for outstanding performance and dedication</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section 
        className="py-16 px-6 text-white"
        style={{ backgroundColor: template.colors.secondary }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <Target className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl mb-8">Future Goals 2025</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Expand to 5 New Cities',
              'Launch Online Platform',
              'Achieve 98% Success Rate'
            ].map((goal, index) => (
              <div key={goal} className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">{goal}</h3>
                <p className="text-sm opacity-90">Strategic goal for continued excellence</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutPreview({ template, sections }: { template: Template; sections: any[] }) {
  return (
    <div className="space-y-0">
      {/* About Hero */}
      <section 
        className="py-20 px-6 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-6">About Excellence Academy</h1>
          <p className="text-xl opacity-90">
            Empowering students to achieve their dreams through quality education and guidance
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <Card className="p-8">
            <h2 className="text-2xl mb-4" style={{ color: template.colors.primary }}>Our Mission</h2>
            <p className="text-gray-600">
              To provide comprehensive, innovative, and personalized education that prepares 
              students for competitive examinations while fostering critical thinking and lifelong learning.
            </p>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl mb-4" style={{ color: template.colors.primary }}>Our Vision</h2>
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

function ContactPreview({ template, sections }: { template: Template; sections: any[] }) {
  return (
    <div className="space-y-0">
      {/* Contact Hero */}
      <section 
        className="py-20 px-6 text-white text-center"
        style={{ 
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Phone className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl mb-6">Contact Us</h1>
          <p className="text-xl opacity-90">
            Get in touch with us to start your journey to success
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl mb-8" style={{ color: template.colors.primary }}>
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
            <h3 className="text-xl mb-4">Send us a message</h3>
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