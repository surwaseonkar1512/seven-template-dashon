import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun,
  RefreshCw,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
  mode: 'admin' | 'user';
  onModeSwitch: (mode: 'admin' | 'user') => void;
  onLogout?: () => void;
}

export function Header({ title, mode, onModeSwitch, onLogout }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'admin' ? 'System Administration' : 'Website Management'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mode Switch */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg border">
            <span className={`text-sm ${mode === 'admin' ? 'font-medium' : 'text-muted-foreground'}`}>
              Admin
            </span>
            <Switch
              checked={mode === 'user'}
              onCheckedChange={(checked) => onModeSwitch(checked ? 'user' : 'admin')}
            />
            <span className={`text-sm ${mode === 'user' ? 'font-medium' : 'text-muted-foreground'}`}>
              User
            </span>
          </div>

          {/* Search */}
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>

          {/* Refresh */}
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {mode === 'admin' ? 'AD' : 'CO'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {mode === 'admin' ? 'Admin User' : 'Coach Name'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {mode === 'admin' ? 'admin@example.com' : 'coach@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onLogout && (
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}