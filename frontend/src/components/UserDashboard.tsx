import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Palette,
  Type,
  Image as ImageIcon,
  Settings,
  Eye,
  Save,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserDashboardProps {
  view: string;
}

export function UserDashboard({ view }: UserDashboardProps) {
  const [siteData, setSiteData] = useState({
    siteName: 'Coach Academy',
    tagline: 'Excellence in Education',
    description: 'Leading coaching institute for competitive exams',
    contact: '+1 234-567-8900',
    email: 'info@coachacademy.com',
    address: '123 Education Street, City, State 12345',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
    theme: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1e293b'
    },
    font: 'Inter',
    template: 'modern-pro'
  });

  const [sections, setSections] = useState({
    banner: {
      enabled: true,
      title: 'Welcome to Coach Academy',
      subtitle: 'Your Success, Our Mission',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
      buttonText: 'Get Started',
      buttonLink: '#contact'
    },
    about: {
      enabled: true,
      title: 'About Our Institute',
      content: 'We are dedicated to providing excellent coaching for competitive exams...',
      achievements: ['10+ Years Experience', '5000+ Students', '95% Success Rate'],
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
    },
    packages: {
      enabled: true,
      plans: [
        {
          name: 'Basic',
          price: '$99',
          duration: 'per month',
          features: ['Online Classes', 'Study Materials', 'Doubt Support'],
          popular: false
        },
        {
          name: 'Premium',
          price: '$199',
          duration: 'per month',
          features: ['Online Classes', 'Study Materials', 'Doubt Support', 'Mock Tests', 'Personal Mentor'],
          popular: true
        },
        {
          name: 'Elite',
          price: '$299',
          duration: 'per month',
          features: ['Everything in Premium', 'One-on-One Sessions', 'Interview Preparation'],
          popular: false
        }
      ]
    },
    advertisements: {
      enabled: true,
      ads: [
        {
          id: '1',
          title: 'Special Discount',
          description: 'Get 30% off on all courses',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
          link: '#packages',
          active: true
        }
      ]
    }
  });

  const handleSaveSection = (sectionName: string, data: any) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: data
    }));
    toast.success(`${sectionName} section updated successfully`);
  };

  const handleColorChange = (colorType: string, color: string) => {
    setSiteData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [colorType]: color
      }
    }));
  };

  const templates = [
    {
      id: 'modern-pro',
      name: 'Modern Pro',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
      description: 'Clean, professional design with modern aesthetics'
    },
    {
      id: 'education-elite',
      name: 'Education Elite',
      thumbnail: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=200&fit=crop',
      description: 'Educational-focused layout with learning elements'
    },
    {
      id: 'corporate-standard',
      name: 'Corporate Standard',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop',
      description: 'Traditional corporate design for established institutes'
    }
  ];

  if (view === 'templates') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Select Template</h2>
          <p className="text-muted-foreground">Choose a design template for your website</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              siteData.template === template.id ? 'ring-2 ring-primary' : ''
            }`}>
              <div className="relative">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                {siteData.template === template.id && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    Current
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{template.name} Preview</DialogTitle>
                        <DialogDescription>Template preview and details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-full rounded-lg"
                        />
                        <p>{template.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setSiteData(prev => ({ ...prev, template: template.id }));
                      toast.success(`Template changed to ${template.name}`);
                    }}
                    disabled={siteData.template === template.id}
                  >
                    {siteData.template === template.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Website Editor</h2>
            <p className="text-muted-foreground">Edit and customize your website sections</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="banner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="banner">Banner</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="banner" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Banner Section</CardTitle>
                    <CardDescription>Main hero section of your website</CardDescription>
                  </div>
                  <Switch 
                    checked={sections.banner.enabled}
                    onCheckedChange={(checked) => 
                      setSections(prev => ({ ...prev, banner: { ...prev.banner, enabled: checked } }))
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="banner-title">Main Title</Label>
                    <Input 
                      id="banner-title"
                      value={sections.banner.title}
                      onChange={(e) => setSections(prev => ({
                        ...prev,
                        banner: { ...prev.banner, title: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner-subtitle">Subtitle</Label>
                    <Input 
                      id="banner-subtitle"
                      value={sections.banner.subtitle}
                      onChange={(e) => setSections(prev => ({
                        ...prev,
                        banner: { ...prev.banner, subtitle: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="banner-image">Background Image URL</Label>
                  <Input 
                    id="banner-image"
                    value={sections.banner.image}
                    onChange={(e) => setSections(prev => ({
                      ...prev,
                      banner: { ...prev.banner, image: e.target.value }
                    }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="banner-button-text">Button Text</Label>
                    <Input 
                      id="banner-button-text"
                      value={sections.banner.buttonText}
                      onChange={(e) => setSections(prev => ({
                        ...prev,
                        banner: { ...prev.banner, buttonText: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner-button-link">Button Link</Label>
                    <Input 
                      id="banner-button-link"
                      value={sections.banner.buttonLink}
                      onChange={(e) => setSections(prev => ({
                        ...prev,
                        banner: { ...prev.banner, buttonLink: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSaveSection('banner', sections.banner)}>
                  Save Banner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>About Section</CardTitle>
                    <CardDescription>Information about your institute</CardDescription>
                  </div>
                  <Switch 
                    checked={sections.about.enabled}
                    onCheckedChange={(checked) => 
                      setSections(prev => ({ ...prev, about: { ...prev.about, enabled: checked } }))
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Section Title</Label>
                  <Input 
                    id="about-title"
                    value={sections.about.title}
                    onChange={(e) => setSections(prev => ({
                      ...prev,
                      about: { ...prev.about, title: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="about-content">Content</Label>
                  <Textarea 
                    id="about-content"
                    value={sections.about.content}
                    onChange={(e) => setSections(prev => ({
                      ...prev,
                      about: { ...prev.about, content: e.target.value }
                    }))}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="about-image">Image URL</Label>
                  <Input 
                    id="about-image"
                    value={sections.about.image}
                    onChange={(e) => setSections(prev => ({
                      ...prev,
                      about: { ...prev.about, image: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>Achievements (one per line)</Label>
                  <Textarea 
                    value={sections.about.achievements.join('\n')}
                    onChange={(e) => setSections(prev => ({
                      ...prev,
                      about: { ...prev.about, achievements: e.target.value.split('\n').filter(line => line.trim()) }
                    }))}
                    rows={3}
                  />
                </div>
                <Button onClick={() => handleSaveSection('about', sections.about)}>
                  Save About
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Packages Section</CardTitle>
                    <CardDescription>Your course packages and pricing</CardDescription>
                  </div>
                  <Switch 
                    checked={sections.packages.enabled}
                    onCheckedChange={(checked) => 
                      setSections(prev => ({ ...prev, packages: { ...prev.packages, enabled: checked } }))
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.packages.plans.map((plan, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Plan Name</Label>
                        <Input 
                          value={plan.name}
                          onChange={(e) => {
                            const newPlans = [...sections.packages.plans];
                            newPlans[index] = { ...plan, name: e.target.value };
                            setSections(prev => ({ ...prev, packages: { ...prev.packages, plans: newPlans } }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input 
                          value={plan.price}
                          onChange={(e) => {
                            const newPlans = [...sections.packages.plans];
                            newPlans[index] = { ...plan, price: e.target.value };
                            setSections(prev => ({ ...prev, packages: { ...prev.packages, plans: newPlans } }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input 
                          value={plan.duration}
                          onChange={(e) => {
                            const newPlans = [...sections.packages.plans];
                            newPlans[index] = { ...plan, duration: e.target.value };
                            setSections(prev => ({ ...prev, packages: { ...prev.packages, plans: newPlans } }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Features (one per line)</Label>
                      <Textarea 
                        value={plan.features.join('\n')}
                        onChange={(e) => {
                          const newPlans = [...sections.packages.plans];
                          newPlans[index] = { ...plan, features: e.target.value.split('\n').filter(line => line.trim()) };
                          setSections(prev => ({ ...prev, packages: { ...prev.packages, plans: newPlans } }));
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <Switch 
                        checked={plan.popular}
                        onCheckedChange={(checked) => {
                          const newPlans = [...sections.packages.plans];
                          newPlans[index] = { ...plan, popular: checked };
                          setSections(prev => ({ ...prev, packages: { ...prev.packages, plans: newPlans } }));
                        }}
                      />
                      <Label>Mark as popular</Label>
                    </div>
                  </Card>
                ))}
                <Button onClick={() => handleSaveSection('packages', sections.packages)}>
                  Save Packages
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Advertisement Section</CardTitle>
                    <CardDescription>Promotional banners and announcements</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Advertisement
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.advertisements.ads.map((ad, index) => (
                  <Card key={ad.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={ad.title} />
                      </div>
                      <div>
                        <Label>Link</Label>
                        <Input value={ad.link} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Description</Label>
                      <Textarea value={ad.description} rows={2} />
                    </div>
                    <div className="mt-4">
                      <Label>Image URL</Label>
                      <Input value={ad.image} />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={ad.active} />
                        <Label>Active</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (view === 'colors') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Color Palette</h2>
          <p className="text-muted-foreground">Customize your website's color scheme</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Settings</CardTitle>
              <CardDescription>Adjust your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(siteData.theme).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key} Color</Label>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-10 h-10 rounded border border-border"
                      style={{ backgroundColor: value }}
                    ></div>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-10 h-10 rounded border border-border cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your colors look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: siteData.theme.background }}>
                <div 
                  className="p-4 rounded text-white"
                  style={{ backgroundColor: siteData.theme.primary }}
                >
                  <h3 className="font-semibold">Primary Color</h3>
                  <p>This is how your primary color looks</p>
                </div>
                <div 
                  className="p-4 rounded text-white"
                  style={{ backgroundColor: siteData.theme.secondary }}
                >
                  <h3 className="font-semibold">Secondary Color</h3>
                  <p>This is your secondary color</p>
                </div>
                <div 
                  className="p-4 rounded text-white"
                  style={{ backgroundColor: siteData.theme.accent }}
                >
                  <h3 className="font-semibold">Accent Color</h3>
                  <p>This is your accent color</p>
                </div>
                <div 
                  className="p-4 rounded"
                  style={{ 
                    backgroundColor: siteData.theme.background,
                    color: siteData.theme.text,
                    border: `1px solid ${siteData.theme.primary}`
                  }}
                >
                  <h3 className="font-semibold">Text Color</h3>
                  <p>This is how your text appears on background</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Reset to Default</Button>
          <Button onClick={() => toast.success('Color palette saved successfully')}>
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  if (view === 'site-settings') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">Configure your website's basic information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential site details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-name">Site Name</Label>
                <Input 
                  id="site-name"
                  value={siteData.siteName}
                  onChange={(e) => setSiteData(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input 
                  id="tagline"
                  value={siteData.tagline}
                  onChange={(e) => setSiteData(prev => ({ ...prev, tagline: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={siteData.description}
                  onChange={(e) => setSiteData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input 
                  id="logo"
                  value={siteData.logo}
                  onChange={(e) => setSiteData(prev => ({ ...prev, logo: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How people can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact">Phone Number</Label>
                <Input 
                  id="contact"
                  value={siteData.contact}
                  onChange={(e) => setSiteData(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={siteData.email}
                  onChange={(e) => setSiteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address"
                  value={siteData.address}
                  onChange={(e) => setSiteData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Choose your website's font</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'].map((font) => (
                <Card 
                  key={font}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    siteData.font === font ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSiteData(prev => ({ ...prev, font }))}
                >
                  <CardContent className="p-4 text-center">
                    <div style={{ fontFamily: font }}>
                      <h3 className="font-semibold mb-2">{font}</h3>
                      <p className="text-sm text-muted-foreground">
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Reset to Default</Button>
          <Button onClick={() => toast.success('Site settings saved successfully')}>
            Save Settings
          </Button>
        </div>
      </div>
    );
  }

  return null;
}