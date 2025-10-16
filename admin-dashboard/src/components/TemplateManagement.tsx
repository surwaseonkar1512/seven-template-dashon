import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Download,
  Upload,
  Star,
  Users,
  Palette,
  Layout
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Education' | 'Corporate' | 'Modern' | 'Classic';
  status: 'Active' | 'Draft' | 'Deprecated';
  thumbnail: string;
  previewImages: string[];
  features: string[];
  usedBy: number;
  rating: number;
  createdDate: string;
  lastModified: string;
  tags: string[];
}

export function TemplateManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Modern Pro',
      description: 'A sleek, professional template perfect for coaching institutes',
      category: 'Modern',
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      previewImages: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
      ],
      features: ['Responsive Design', 'Dark Mode', 'Custom Colors', 'SEO Optimized'],
      usedBy: 45,
      rating: 4.8,
      createdDate: '2024-01-15',
      lastModified: '2024-09-20',
      tags: ['professional', 'modern', 'responsive']
    },
    {
      id: '2',
      name: 'Education Elite',
      description: 'Educational-focused design with learning-centric features',
      category: 'Education',
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
      previewImages: [
        'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      ],
      features: ['Course Catalog', 'Student Portal', 'Progress Tracking', 'Discussion Forums'],
      usedBy: 32,
      rating: 4.6,
      createdDate: '2024-02-10',
      lastModified: '2024-10-01',
      tags: ['education', 'learning', 'courses']
    },
    {
      id: '3',
      name: 'Corporate Standard',
      description: 'Traditional corporate design for established institutions',
      category: 'Corporate',
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      previewImages: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
      ],
      features: ['Professional Layout', 'Business Forms', 'Team Showcase', 'Contact Integration'],
      usedBy: 28,
      rating: 4.4,
      createdDate: '2024-01-30',
      lastModified: '2024-08-15',
      tags: ['corporate', 'business', 'professional']
    },
    {
      id: '4',
      name: 'Classic Academic',
      description: 'Timeless design inspired by traditional academic institutions',
      category: 'Classic',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      previewImages: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop'
      ],
      features: ['Traditional Layout', 'Academic Calendar', 'Library Integration', 'Alumni Network'],
      usedBy: 12,
      rating: 4.2,
      createdDate: '2024-03-05',
      lastModified: '2024-09-10',
      tags: ['classic', 'academic', 'traditional']
    }
  ];

  const [templates, setTemplates] = useState(mockTemplates);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Deprecated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Education': return 'bg-blue-100 text-blue-800';
      case 'Corporate': return 'bg-purple-100 text-purple-800';
      case 'Modern': return 'bg-green-100 text-green-800';
      case 'Classic': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
    toast.success('Template deleted successfully');
  };

  const TemplateCard = ({ template }: { template: Template }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <img 
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 space-y-2">
            <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
            <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs">{template.rating}</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">{template.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{template.usedBy} users</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{template.name} - Preview</DialogTitle>
                  <DialogDescription>Template details and preview images</DialogDescription>
                </DialogHeader>
                {selectedTemplate && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <img 
                          src={selectedTemplate.previewImages[0]} 
                          alt={selectedTemplate.name}
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Features</h4>
                          <ul className="space-y-1">
                            {selectedTemplate.features.map((feature, index) => (
                              <li key={index} className="text-sm flex items-center space-x-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Category:</span>
                              <Badge className={getCategoryColor(selectedTemplate.category)}>
                                {selectedTemplate.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Rating:</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span>{selectedTemplate.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Used by:</span>
                              <span>{selectedTemplate.usedBy} users</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{selectedTemplate.createdDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedTemplate.previewImages.length > 1 && (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedTemplate.previewImages.slice(1).map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`${selectedTemplate.name} preview ${index + 2}`}
                            className="w-full rounded-lg shadow-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={() => {
              setSelectedTemplate(template);
              setIsEditMode(true);
            }}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteTemplate(template.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Template Management</h2>
          <p className="text-muted-foreground">Manage website templates and designs</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Add a new website template to the library</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" placeholder="Enter template name" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the template..." />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="modern, responsive, professional" />
                </div>
                <div>
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input id="thumbnail" placeholder="https://example.com/thumbnail.jpg" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => toast.success('Template created successfully')}>
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <Layout className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.status === 'Active').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{templates.reduce((acc, t) => acc + t.usedBy, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(templates.reduce((acc, t) => acc + t.rating, 0) / templates.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or create a new template.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}