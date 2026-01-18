import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, UserX, UserCheck, Users } from 'lucide-react';

// Mock users data
const mockUsers = [
  { _id: '1', fullName: 'John Doe', email: 'john@example.com', role: 'buyer', accountStatus: 'active', createdAt: '2024-01-15' },
  { _id: '2', fullName: 'Jane Smith', email: 'jane@example.com', role: 'seller', accountStatus: 'active', createdAt: '2024-01-10' },
  { _id: '3', fullName: 'Bob Wilson', email: 'bob@example.com', role: 'buyer', accountStatus: 'frozen', createdAt: '2024-01-05' },
  { _id: '4', fullName: 'Alice Brown', email: 'alice@example.com', role: 'seller', accountStatus: 'active', createdAt: '2024-01-01' },
  { _id: '5', fullName: 'Charlie Davis', email: 'charlie@example.com', role: 'buyer', accountStatus: 'suspended', createdAt: '2023-12-20' },
];

type UserStatus = 'active' | 'frozen' | 'suspended';

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with adminService.getAllUsers()
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsers(mockUsers);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = async (userId: string) => {
    try {
      // Replace with adminService.freezeUser(userId)
      setUsers(users.map(u => u._id === userId ? { ...u, accountStatus: 'frozen' } : u));
      toast({
        title: 'User Frozen',
        description: 'The user account has been frozen successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to freeze user account.',
        variant: 'destructive',
      });
    }
  };

  const handleUnfreeze = async (userId: string) => {
    try {
      // Replace with adminService.unfreezeUser(userId)
      setUsers(users.map(u => u._id === userId ? { ...u, accountStatus: 'active' } : u));
      toast({
        title: 'User Unfrozen',
        description: 'The user account has been activated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unfreeze user account.',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<UserStatus, { className: string; label: string }> = {
      active: { className: 'status-completed', label: 'Active' },
      frozen: { className: 'status-pending', label: 'Frozen' },
      suspended: { className: 'status-cancelled', label: 'Suspended' },
    };
    const { className, label } = variants[status] || variants.active;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      buyer: 'bg-primary/10 text-primary border-primary/20',
      seller: 'bg-accent/10 text-accent border-accent/20',
      admin: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return (
      <Badge variant="outline" className={colors[role] || colors.buyer}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            Manage Users
          </h1>
          <p className="text-muted-foreground">View and manage all registered users</p>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No users found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.fullName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.accountStatus as UserStatus)}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            {user.accountStatus === 'active' ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-warning hover:text-warning">
                                    <UserX className="h-4 w-4 mr-1" />
                                    Freeze
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Freeze User Account</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to freeze {user.fullName}'s account? They will not be able to access their account until it is unfrozen.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleFreeze(user._id)}>
                                      Freeze Account
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-success hover:text-success"
                                onClick={() => handleUnfreeze(user._id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Unfreeze
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
