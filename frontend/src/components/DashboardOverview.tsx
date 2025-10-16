import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, LayoutTemplate, Globe, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardOverviewProps {
  mode: 'admin' | 'user';
}

export function DashboardOverview({ mode }: DashboardOverviewProps) {
  const [counters, setCounters] = useState({
    users: 0,
    templates: 0,
    websites: 0,
    revenue: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = mode === 'admin' 
      ? { users: 156, templates: 24, websites: 89, revenue: 45000 }
      : { users: 1, templates: 1, websites: 1, revenue: 2500 };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        users: Math.floor(targets.users * easeOutQuart),
        templates: Math.floor(targets.templates * easeOutQuart),
        websites: Math.floor(targets.websites * easeOutQuart),
        revenue: Math.floor(targets.revenue * easeOutQuart)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [mode]);

  const chartData = [
    { name: 'Jan', value: 400, users: 24 },
    { name: 'Feb', value: 300, users: 13 },
    { name: 'Mar', value: 600, users: 45 },
    { name: 'Apr', value: 800, users: 67 },
    { name: 'May', value: 500, users: 34 },
    { name: 'Jun', value: 900, users: 89 },
  ];

  const adminStats = [
    {
      title: 'Total Users',
      value: counters.users,
      icon: Users,
      description: '+12% from last month',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Templates',
      value: counters.templates,
      icon: LayoutTemplate,
      description: '3 new this week',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Active Websites',
      value: counters.websites,
      icon: Globe,
      description: '+8% from last month',
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: `$${counters.revenue.toLocaleString()}`,
      icon: DollarSign,
      description: '+15% from last month',
      trend: 'up',
      color: 'text-orange-600'
    }
  ];

  const userStats = [
    {
      title: 'Website Status',
      value: 'Active',
      icon: Globe,
      description: 'Last updated 2 hours ago',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Selected Template',
      value: 'Modern Pro',
      icon: LayoutTemplate,
      description: 'Changed 3 days ago',
      trend: 'neutral',
      color: 'text-blue-600'
    },
    {
      title: 'Page Views',
      value: counters.revenue,
      icon: Activity,
      description: '+25% this month',
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'Active Sections',
      value: '7/10',
      icon: TrendingUp,
      description: '3 sections pending',
      trend: 'neutral',
      color: 'text-orange-600'
    }
  ];

  const stats = mode === 'admin' ? adminStats : userStats;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>{stat.description}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'admin' ? 'Website Creation Trend' : 'Website Traffic'}</CardTitle>
            <CardDescription>
              {mode === 'admin' ? 'New websites created over time' : 'Visitor analytics for your site'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'admin' ? 'User Growth' : 'Engagement Metrics'}</CardTitle>
            <CardDescription>
              {mode === 'admin' ? 'New user registrations' : 'User engagement with your content'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mode === 'admin' ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New user "CoachAcademy" registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <Badge variant="outline">New User</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Template "Education Pro" was updated</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                  <Badge variant="outline">Template</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">System maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                  <Badge variant="outline">System</Badge>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Website sections updated successfully</p>
                    <p className="text-xs text-muted-foreground">30 minutes ago</p>
                  </div>
                  <Badge variant="outline">Update</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Color palette changed to "Blue Ocean"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="outline">Design</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New advertisement banner added</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <Badge variant="outline">Content</Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium mb-2">
              {mode === 'admin' ? 'Create New Template' : 'Preview Website'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'admin' ? 'Add a new template design' : 'View your live website'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium mb-2">
              {mode === 'admin' ? 'Manage Users' : 'Edit Content'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'admin' ? 'View and edit user accounts' : 'Update your website content'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium mb-2">
              {mode === 'admin' ? 'View Analytics' : 'Customize Design'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'admin' ? 'Check system performance' : 'Modify colors and layout'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}