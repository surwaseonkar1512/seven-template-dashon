import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    GripVertical, Eye, Edit, Settings,
    Sparkles, Shield, BookOpen, Users, MessageSquare
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import BannerSection from '../components/HomePageSection/BannerSection';
import { TemplatePreview } from '../components/TemplatePreview';
import TestimonialSection from '../components/HomePageSection/Testimonial';

// Dummy API
const updateSectionOrderAPI = async (sections: Section[]) => {
    console.log('🔁 Updating section order on server...');
    console.table(sections.map(s => ({ id: s.id, order: s.order })));
    return Promise.resolve({ success: true });
};

interface Section {
    id: string;
    name: string;
    icon: any;
    description: string;
    enabled: boolean;
    order: number;
    type: string;
    color: string;
    bgColor: string;
}

/* ------------------ Draggable Section ------------------ */
function DraggableSection({
    section, index, isSelected, onSelect, onToggle, moveSection
}: {
    section: Section;
    index: number;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onToggle: (id: string, enabled: boolean) => void;
    moveSection: (dragIndex: number, hoverIndex: number) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: 'SECTION',
        hover: (item: { index: number }) => {
            if (!ref.current) return;
            if (item.index === index) return;
            moveSection(item.index, index);
            item.index = index;
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'SECTION',
        item: { index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const Icon = section.icon;

    return (
        <motion.div
            ref={ref}
            layout
            animate={{ opacity: isDragging ? 0.5 : 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(section.id)}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all 
        ${isSelected ? 'shadow-xl shadow-blue-500/25 scale-105' : 'hover:shadow-lg'}
        ${isDragging ? 'rotate-2' : ''}`}
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
                        <GripVertical
                            className={`h-4 w-4 opacity-60 ${isSelected ? 'text-white' : 'text-gray-400'}`}
                        />
                        <div
                            className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}
                            style={{ backgroundColor: !isSelected ? section.bgColor : undefined }}
                        >
                            <Icon
                                className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-700'}`}
                                style={{ color: !isSelected ? section.color : undefined }}
                            />
                        </div>
                        <div>
                            <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                {section.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={section.enabled}
                            onCheckedChange={(enabled: boolean) => onToggle(section.id, enabled)}
                            onClick={(e: any) => e.stopPropagation()}
                        />
                        {!section.enabled && (
                            <Badge
                                variant="secondary"
                                className={`${isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'}`}
                            >
                                Hidden
                            </Badge>
                        )}
                    </div>
                </div>

                <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                    {section.description}
                </p>
            </div>
        </motion.div>
    );
}

/* ------------------ Main Component ------------------ */
export function HomePageManagement() {
    const storedId = localStorage.getItem("selectedUserId");
    const [selectedSection, setSelectedSection] = useState('hero');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const [sections, setSections] = useState<Section[]>([
        { id: 'hero', name: 'Hero Section', icon: Sparkles, description: 'Main banner with hero content', enabled: true, order: 1, type: 'hero', color: '#3b82f6', bgColor: '#dbeafe' },
        { id: 'about', name: 'About Institute', icon: Shield, description: 'Institute information and history', enabled: true, order: 2, type: 'about', color: '#8b5cf6', bgColor: '#ede9fe' },
        { id: 'courses', name: 'Courses Offered', icon: BookOpen, description: 'Available courses and programs', enabled: true, order: 3, type: 'courses', color: '#f59e0b', bgColor: '#fef3c7' },
        { id: 'faculty', name: 'Faculty', icon: Users, description: 'Expert teaching staff', enabled: true, order: 4, type: 'faculty', color: '#ef4444', bgColor: '#fee2e2' },
        { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, description: 'Student feedback', enabled: false, order: 5, type: 'testimonials', color: '#10b981', bgColor: '#d1fae5' },
    ]);

    // Toggle section visibility
    const handleToggle = useCallback((id: string, enabled: boolean) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, enabled } : s));
        const section = sections.find(s => s.id === id);
        toast.success(`${section?.name} ${enabled ? 'enabled' : 'disabled'}`);
    }, [sections]);

    // Handle reordering
    const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
        setSections(prev => {
            const reordered = [...prev];
            const [dragged] = reordered.splice(dragIndex, 1);
            reordered.splice(hoverIndex, 0, dragged);

            const updated = reordered.map((s, i) => ({ ...s, order: i + 1 }));
            updateSectionOrderAPI(updated);
            return updated;
        });
    }, []);

    const currentSection = sections.find(s => s.id === selectedSection);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Sidebar */}
                <aside className="w-80 bg-white border-r shadow-lg flex flex-col">
                    <div className="p-6 border-b bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Settings className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Section Management</h2>
                                <p className="text-sm text-gray-300">Drag, toggle, and edit sections</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                size="sm"
                                onClick={() => setIsPreviewMode(false)}
                                variant={!isPreviewMode ? "default" : "outline"}
                            >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setIsPreviewMode(true)}
                                variant={isPreviewMode ? "default" : "outline"}
                            >
                                <Eye className="h-4 w-4 mr-2" /> Preview
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {sections.sort((a, b) => a.order - b.order).map((section, i) => (
                            <DraggableSection
                                key={section.id}
                                section={section}
                                index={i}
                                isSelected={selectedSection === section.id}
                                onSelect={setSelectedSection}
                                onToggle={handleToggle}
                                moveSection={moveSection}
                            />
                        ))}
                    </div>
                </aside>

                {/* Right side */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {isPreviewMode ? (
                        <TemplatePreview
                            type="homepage"
                            sections={sections.filter(s => s.enabled)}
                            title="Homepage Preview"
                        />
                    ) : currentSection?.id === 'hero' ? (
                        <BannerSection userId={storedId} />
                        // TestimonialSection
                    )
                        : currentSection?.id === 'testimonials' ? (
                            <TestimonialSection userId={storedId} />
                            // 
                        ) : (
                            <div className="text-center mt-20 text-gray-500 text-lg">
                                ✨ {currentSection?.name || 'Select a section'} Editor Coming Soon
                            </div>
                        )}
                </main>
            </div>
        </DndProvider>
    );
}
