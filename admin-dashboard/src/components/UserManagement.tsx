import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  institute: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  lastActive: string;
  website: string;
  template: string;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@coachacademy.com',
      phone: '+1 234-567-8901',
      institute: 'Coach Academy',
      plan: 'Pro',
      status: 'Active',
      joinDate: '2024-01-15',
      lastActive: '2024-10-06',
      website: 'coachacademy.com',
      template: 'Modern Pro'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@edutech.com',
      phone: '+1 234-567-8902',
      institute: 'EduTech Institute',
      plan: 'Enterprise',
      status: 'Active',
      joinDate: '2024-02-20',
      lastActive: '2024-10-05',
      website: 'edutech-institute.com',
      template: 'Education Elite'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@learninghub.com',
      phone: '+1 234-567-8903',
      institute: 'Learning Hub',
      plan: 'Free',
      status: 'Pending',
      joinDate: '2024-10-01',
      lastActive: '2024-10-03',
      website: 'learninghub.com',
      template: 'Basic Template'
    },
    {
      id: '4',
      name: 'David Kumar',
      email: 'david@skillboost.com',
      phone: '+1 234-567-8904',
      institute: 'SkillBoost Center',
      plan: 'Pro',
      status: 'Inactive',
      joinDate: '2024-03-10',
      lastActive: '2024-09-15',
      website: 'skillboost.com',
      template: 'Professional'
    }
  ];

  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.institute.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    const matchesPlan = planFilter === 'all' || user.plan.toLowerCase() === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      if (isEditMode) {
        setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
        toast.success('User updated successfully');
      } else {
        const newUser = { ...selectedUser, id: Date.now().toString() };
        setUsers([...users, newUser]);
        toast.success('User created successfully');
      }
      setSelectedUser(null);
      setIsEditMode(false);
    }
  };

  const UserForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, name: e.target.value} : null)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, email: e.target.value} : null)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone"
            value={selectedUser?.phone || ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, phone: e.target.value} : null)}
          />
        </div>
        <div>
          <Label htmlFor="institute">Institute Name</Label>
          <Input 
            id="institute"
            value={selectedUser?.institute || ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, institute: e.target.value} : null)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plan">Plan</Label>
          <Select value={selectedUser?.plan || ''} onValueChange={(value) => 
            setSelectedUser(prev => prev ? {...prev, plan: value as any} : null)
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={selectedUser?.status || ''} onValueChange={(value) => 
            setSelectedUser(prev => prev ? {...prev, status: value as any} : null)
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website URL</Label>
        <Input 
          id="website"
          value={selectedUser?.website || ''}
          onChange={(e) => setSelectedUser(prev => prev ? {...prev, website: e.target.value} : null)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage coaching institute accounts and permissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setSelectedUser({
                  id: '',
                  name: '',
                  email: '',
                  phone: '',
                  institute: '',
                  plan: 'Free',
                  status: 'Pending',
                  joinDate: new Date().toISOString().split('T')[0],
                  lastActive: new Date().toISOString().split('T')[0],
                  website: '',
                  template: 'Basic Template'
                });
                setIsEditMode(false);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update user information and settings' : 'Create a new coaching institute account'}
              </DialogDescription>
            </DialogHeader>
            <UserForm />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveUser}>
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Pro Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.plan === 'Pro').length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'Pending').length}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
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
                  placeholder="Search users by name, email, or institute..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage all coaching institute accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Institute</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.institute}</p>
                      <p className="text-sm text-muted-foreground">{user.website}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(user.plan)}>{user.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>View complete user information</DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedUser.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedUser.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedUser.institute}</span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Joined {selectedUser.joinDate}</span>
                                  </div>
                                  <div>
                                    <Badge className={getPlanColor(selectedUser.plan)}>{selectedUser.plan}</Badge>
                                  </div>
                                  <div>
                                    <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditMode(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Update user information and settings</DialogDescription>
                          </DialogHeader>
                          <UserForm />
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handleSaveUser}>Update User</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}