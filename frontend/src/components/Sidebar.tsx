import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  LayoutDashboard,
  Users,
  LayoutTemplate,
  Settings,
  Bell,
  User,
  Palette,
  Globe,
  Image,
  ChevronLeft,
  ChevronRight,
  Info,
  Phone,
  Trophy,
  Eye,
  UserPlus,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  mode: any;
  onLogout?: () => void;
}

interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Sidebar({ currentView, onViewChange, mode, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const adminMenuGroups: MenuGroup[] = [

    {
      title: 'User Management',
      items: [
        { id: 'users', label: 'All Users', icon: Users, badgeVariant: 'secondary' },
        { id: 'create-user', label: 'Create User', icon: UserPlus },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { id: 'templates', label: 'Templates', icon: LayoutTemplate },
        { id: 'template-preview', label: 'Preview', icon: Eye },
        { id: 'sections', label: 'Homepage Sections', icon: Globe },
        { id: 'about-us', label: 'About Us', icon: Info },
        { id: 'contact-us', label: 'Contact Us', icon: Phone },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5', badgeVariant: 'destructive' },
        { id: 'profile', label: 'Profile', icon: User },
      ]
    }
  ];

  const userMenuGroups: MenuGroup[] = [

    {
      title: 'Website',
      items: [
        { id: 'templates', label: 'Select Template', icon: LayoutTemplate },
        { id: 'editor', label: 'Website Editor', icon: Globe },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { id: 'templates', label: 'Templates', icon: LayoutTemplate },
        { id: 'template-preview', label: 'Preview', icon: Eye },
        { id: 'sections', label: 'Homepage Sections', icon: Globe },
        { id: 'about-us', label: 'About Us', icon: Info },
        { id: 'contact-us', label: 'Contact Us', icon: Phone },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
      ]
    },
    {
      title: 'Customization',
      items: [
        { id: 'colors', label: 'Color Palette', icon: Palette },
        { id: 'ads', label: 'Advertisement', icon: Image },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'site-settings', label: 'Site Settings', icon: Settings },
        { id: 'profile', label: 'Profile', icon: User },
      ]
    }
  ];

  const menuGroups = mode === 'admin' ? adminMenuGroups : userMenuGroups;

  const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    const isHovered = hoveredItem === item.id;

    const button = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`
          w-full justify-start transition-all duration-200 group relative
          ${collapsed ? 'px-2 justify-center' : 'px-3'}
          ${isActive ? 'shadow-sm' : ''}
          ${!isActive && isHovered ? 'bg-accent' : ''}
        `}
        onClick={() => onViewChange(item.id)}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Active indicator */}
        {isActive && !collapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
        )}

        <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'} transition-transform duration-200 ${isHovered && !isActive ? 'scale-110' : ''}`} />

        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge && (
              <Badge
                variant={item.badgeVariant || 'secondary'}
                className="ml-auto text-xs px-1.5 py-0.5 h-5"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.label}
              {item.badge && (
                <Badge variant={item.badgeVariant || 'secondary'} className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <div className={`bg-gradient-to-b from-card to-card/80 border-r shadow-sm transition-all duration-300 flex flex-col h-screen ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Header */}
      <div className="p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {mode === 'admin' ? 'Admin Panel' : 'Coach Hub'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {mode === 'admin' ? 'System Control' : 'Your Dashboard'}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={`${collapsed ? 'w-full' : 'ml-auto'} hover:bg-accent transition-colors`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {!collapsed && group.title && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>
            )}
            {collapsed && group.title && groupIndex > 0 && (
              <Separator className="my-2" />
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <MenuItemComponent key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t bg-card/50 backdrop-blur-sm">
        {!collapsed ? (
          <div className="p-4 space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold">
                  {mode === 'admin' ? 'A' : 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {mode === 'admin' ? 'Admin User' : 'Coach Name'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {mode === 'admin' ? 'admin@example.com' : 'coach@example.com'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 transition-all duration-200"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {/* User Avatar */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
                      <span className="text-white font-semibold">
                        {mode === 'admin' ? 'A' : 'C'}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-sm">
                    <p className="font-medium">
                      {mode === 'admin' ? 'Admin User' : 'Coach Name'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mode === 'admin' ? 'admin@example.com' : 'coach@example.com'}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Logout Button */}
            {onLogout && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={onLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Logout
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
