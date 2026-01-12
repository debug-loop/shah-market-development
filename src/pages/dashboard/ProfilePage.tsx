import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, Check, Wallet, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { mockUser, mockStats, mockWallet, mockReferral } from '@/data/mockData';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Bangladesh',
  'India',
  'Pakistan',
];

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: mockUser.name,
    phone: mockUser.phone || '',
    country: mockUser.country || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Profile updated:', formData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={mockUser.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {mockUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium">{mockUser.name}</p>
                      <p className="text-sm text-muted-foreground">User ID: {mockUser.userId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          value={mockUser.email}
                          disabled
                          className="pr-24"
                        />
                        <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-success text-success-foreground">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* User ID - Read Only */}
                    <div className="space-y-2">
                      <Label htmlFor="userId">User ID</Label>
                      <Input id="userId" value={mockUser.userId} disabled />
                    </div>
                  </div>

                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                    <p className="text-2xl font-bold">{mockStats.completedOrders}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <XCircle className="h-6 w-6 mx-auto mb-2 text-destructive" />
                    <p className="text-2xl font-bold">{mockStats.cancelledOrders}</p>
                    <p className="text-sm text-muted-foreground">Cancelled</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-2">Account Status</p>
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Since {mockUser.memberSince}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Wallet & Referral Summary */}
          <div className="space-y-6">
            {/* Wallet Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className="text-lg font-bold text-success">${mockWallet.availableBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pending Balance</span>
                    <span className="font-medium text-warning">${mockWallet.pendingBalance.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Deposit</Button>
                  <Button size="sm" variant="outline" className="flex-1">Withdraw</Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Referral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Your Referral Link</p>
                  <p className="text-sm font-mono break-all">{mockReferral.referralLink}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{mockReferral.totalReferrals}</p>
                    <p className="text-xs text-muted-foreground">Total Referrals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">${mockReferral.totalEarnings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Copy Referral Link</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}