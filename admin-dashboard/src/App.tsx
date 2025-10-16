import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { UserManagement } from './components/UserManagement';
import { TemplateManagement } from './components/TemplateManagement';
import { UserDashboard } from './components/UserDashboard';
import { SectionManagement } from './components/SectionManagement';
import { AboutUsManagement } from './components/AboutUsManagement';
import { ContactUsManagement } from './components/ContactUsManagement';
import { AchievementsManagement } from './components/AchievementsManagement';
import { TemplatePreviewTab } from './components/TemplatePreviewTab';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { AdminCreateUser } from './components/AdminCreateUser';

type AuthPage = 'login' | 'signup' | 'forgot-password';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [mode, setMode] = useState<'admin' | 'user'>('admin');
  const [currentView, setCurrentView] = useState('dashboard');

  // Authentication handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAuthPage('login');
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    setAuthPage('login');
  };

  const handleForgotPasswordSuccess = () => {
    setAuthPage('login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage('login');
    setCurrentView('dashboard');
  };

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    switch (authPage) {
      case 'signup':
        return (
          <>
            <SignupPage
              onSignupSuccess={handleSignupSuccess}
              onSwitchToLogin={() => setAuthPage('login')}
            />
            <Toaster richColors position="top-right" />
          </>
        );
      case 'forgot-password':
        return (
          <>
            <ForgotPasswordPage
              onBackToLogin={() => setAuthPage('login')}
              onResetSuccess={handleForgotPasswordSuccess}
            />
            <Toaster richColors position="top-right" />
          </>
        );
      default:
        return (
          <>
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onSwitchToSignup={() => setAuthPage('signup')}
              onSwitchToForgotPassword={() => setAuthPage('forgot-password')}
            />
            <Toaster richColors position="top-right" />
          </>
        );
    }
  }

  const getPageTitle = () => {
    if (mode === 'admin') {
      switch (currentView) {
        case 'dashboard': return 'Admin Dashboard';
        case 'users': return 'User Management';
        case 'create-user': return 'Create New User';
        case 'templates': return 'Template Management';
        case 'template-preview': return 'Template Preview';
        case 'sections': return 'Homepage Section Management';
        case 'about-us': return 'About Us Page Management';
        case 'contact-us': return 'Contact Us Page Management';
        case 'achievements': return 'Achievement Year Management';
        case 'settings': return 'Global Settings';
        case 'notifications': return 'Notifications & Logs';
        case 'profile': return 'Admin Profile';
        default: return 'Admin Dashboard';
      }
    } else {
      switch (currentView) {
        case 'dashboard': return 'Coach Dashboard';
        case 'templates': return 'Select Template';
        case 'editor': return 'Website Editor';
        case 'about-us': return 'About Us Management';
        case 'contact-us': return 'Contact Us Management';
        case 'achievements': return 'Achievement Year Management';
        case 'colors': return 'Color Palette';
        case 'ads': return 'Advertisement Management';
        case 'site-settings': return 'Site Settings';
        case 'profile': return 'Profile Settings';
        default: return 'Coach Dashboard';
      }
    }
  };

  const renderContent = () => {
    if (mode === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <DashboardOverview mode="admin" />;
        case 'users':
          return <UserManagement />;
        case 'create-user':
          return <AdminCreateUser 
            onUserCreated={() => setCurrentView('users')}
            onCancel={() => setCurrentView('users')}
          />;
        case 'templates':
          return <TemplateManagement />;
        case 'template-preview':
          return <TemplatePreviewTab />;
        case 'sections':
          return <SectionManagement />;
        case 'about-us':
          return <AboutUsManagement />;
        case 'contact-us':
          return <ContactUsManagement />;
        case 'achievements':
          return <AchievementsManagement />;
        case 'settings':
          return <GlobalSettings />;
        case 'notifications':
          return <NotificationsLogs />;
        case 'profile':
          return <ProfileSettings mode="admin" />;
        default:
          return <DashboardOverview mode="admin" />;
      }
    } else {
      switch (currentView) {
        case 'dashboard':
          return <DashboardOverview mode="user" />;
        case 'templates':
        case 'editor':
        case 'colors':
        case 'ads':
        case 'site-settings':
          return <UserDashboard view={currentView} />;
        case 'about-us':
          return <AboutUsManagement />;
        case 'contact-us':
          return <ContactUsManagement />;
        case 'achievements':
          return <AchievementsManagement />;
        case 'profile':
          return <ProfileSettings mode="user" />;
        default:
          return <DashboardOverview mode="user" />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        mode={mode}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title={getPageTitle()}
          mode={mode}
          onModeSwitch={setMode}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Toaster richColors position="top-right" />
    </div>
  );
}

// Placeholder components for remaining views

function GlobalSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Global Settings</h2>
        <p className="text-muted-foreground">System-wide configuration and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">System Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Maintenance Mode</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>User Registration</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Timeout (minutes)
                </label>
                <input 
                  type="number" 
                  defaultValue="30"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password Requirements
                </label>
                <select className="w-full p-2 border rounded">
                  <option>Standard</option>
                  <option>Strong</option>
                  <option>Very Strong</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Default Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded cursor-pointer hover:bg-gray-50">
                <div className="w-full h-20 bg-blue-500 rounded mb-2"></div>
                <span className="text-sm">Blue Theme</span>
              </div>
              <div className="p-4 border rounded cursor-pointer hover:bg-gray-50">
                <div className="w-full h-20 bg-green-500 rounded mb-2"></div>
                <span className="text-sm">Green Theme</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Backup & Export</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-primary text-white rounded hover:bg-primary/90">
                Download System Backup
              </button>
              <button className="w-full p-3 border rounded hover:bg-gray-50">
                Export User Data
              </button>
              <button className="w-full p-3 border rounded hover:bg-gray-50">
                Export Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications & Logs</h2>
        <p className="text-muted-foreground">System notifications and activity logs</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="divide-y">
              {[
                { action: 'New user registered', user: 'Sarah Johnson', time: '2 min ago', type: 'user' },
                { action: 'Template updated', user: 'System', time: '15 min ago', type: 'template' },
                { action: 'User plan upgraded', user: 'Michael Chen', time: '1 hour ago', type: 'billing' },
                { action: 'System backup completed', user: 'System', time: '2 hours ago', type: 'system' },
                { action: 'New template created', user: 'Admin', time: '3 hours ago', type: 'template' }
              ].map((log, index) => (
                <div key={index} className="p-4 flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'user' ? 'bg-blue-500' :
                    log.type === 'template' ? 'bg-green-500' :
                    log.type === 'billing' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {log.user} • {log.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.type === 'user' ? 'bg-blue-100 text-blue-800' :
                    log.type === 'template' ? 'bg-green-100 text-green-800' :
                    log.type === 'billing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Today's Logins</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New Users</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">System Errors</span>
                <span className="font-semibold text-red-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Server Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Alerts</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Activity</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Updates</span>
                <input type="checkbox" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ mode }: { mode: 'admin' | 'user' }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your {mode === 'admin' ? 'admin' : 'coach'} profile and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={mode === 'admin' ? 'Admin User' : 'Coach Name'}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue={mode === 'admin' ? 'admin@example.com' : 'coach@example.com'}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input 
                  type="tel" 
                  defaultValue="+1 234-567-8900"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              <button className="w-full p-3 border rounded hover:bg-gray-50 text-left">
                Change Password
              </button>
              <button className="w-full p-3 border rounded hover:bg-gray-50 text-left">
                Enable Two-Factor Authentication
              </button>
              <button className="w-full p-3 border rounded hover:bg-gray-50 text-left">
                Download Login History
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Profile Picture</h3>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl">
                {mode === 'admin' ? 'A' : 'C'}
              </div>
              <div>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                  Upload New
                </button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG up to 2MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className="w-full p-2 border rounded">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select className="w-full p-2 border rounded">
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
              Save Changes
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}