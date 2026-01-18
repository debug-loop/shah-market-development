import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserCheck, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';

// Mock admin stats - replace with actual API call
const mockAdminStats = {
  totalUsers: 1284,
  totalBuyers: 892,
  totalSellers: 392,
  pendingSellers: 12,
  totalProducts: 3547,
  pendingProducts: 28,
  totalOrders: 8934,
  completedOrders: 7823,
  totalRevenue: 245678.50,
  pendingDisputes: 5,
  pendingWithdrawals: 8,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<typeof mockAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call - replace with actual adminService.getDashboard()
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats(mockAdminStats);
      } catch (err) {
        console.error('Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and pending actions</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers.toLocaleString() || '0'}
            subtitle={`Buyers: ${stats?.totalBuyers} | Sellers: ${stats?.totalSellers}`}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pending Sellers"
            value={stats?.pendingSellers.toString() || '0'}
            subtitle="Awaiting approval"
            icon={UserCheck}
            iconColor="text-warning"
          />
          <StatCard
            title="Total Products"
            value={stats?.totalProducts.toLocaleString() || '0'}
            subtitle={`Pending: ${stats?.pendingProducts}`}
            icon={Package}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders.toLocaleString() || '0'}
            subtitle={`Completed: ${stats?.completedOrders}`}
            icon={ShoppingBag}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Revenue & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                Platform Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                ${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-success" />
                <span>+18% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    <span className="text-sm">Seller Applications</span>
                  </div>
                  <span className="text-sm font-medium">{stats?.pendingSellers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    <span className="text-sm">Product Approvals</span>
                  </div>
                  <span className="text-sm font-medium">{stats?.pendingProducts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-sm">Open Disputes</span>
                  </div>
                  <span className="text-sm font-medium">{stats?.pendingDisputes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">Withdrawal Requests</span>
                  </div>
                  <span className="text-sm font-medium">{stats?.pendingWithdrawals}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Requires Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="text-2xl font-bold text-warning">{stats?.pendingSellers}</div>
                <div className="text-sm text-muted-foreground mt-1">Seller applications pending review</div>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="text-2xl font-bold text-warning">{stats?.pendingProducts}</div>
                <div className="text-sm text-muted-foreground mt-1">Products awaiting approval</div>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-2xl font-bold text-destructive">{stats?.pendingDisputes}</div>
                <div className="text-sm text-muted-foreground mt-1">Disputes need resolution</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
