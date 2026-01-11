import { useState } from 'react';
import { Save, Upload, CheckCircle, Shield, Mail, User, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockSeller } from '@/data/mockSellerData';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    displayName: mockSeller.displayName,
    email: mockSeller.email,
    bio: 'Professional digital products seller with 5+ years of experience.',
    website: '',
    telegram: '',
  });

  const handleSave = () => {
    // TODO: Connect to Express.js backend
    // PUT /api/seller/profile
    // Body: formData
    
    console.log('Saving profile:', formData);
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleRequestVerification = () => {
    // TODO: Connect to Express.js backend
    // POST /api/seller/profile/verify
    
    toast({
      title: 'Verification Requested',
      description: 'Your verification request has been submitted. We will review it shortly.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Verification</h1>
        <p className="text-muted-foreground">Manage your seller profile and verification status</p>
      </div>

      {/* Account Status */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Seller Status</p>
                <p className="font-semibold text-green-500">Approved</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-semibold">{mockSeller.rating} / 5.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10">
              {mockSeller.isVerified ? (
                <>
                  <CheckCircle className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Verification</p>
                    <p className="font-semibold text-secondary">Verified ✓</p>
                  </div>
                </>
              ) : (
                <>
                  <Shield className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Verification</p>
                    <p className="font-semibold">Not Verified</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {!mockSeller.isVerified && (
            <div className="mt-4 p-4 rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Get verified to increase buyer trust and access premium features.
              </p>
              <Button onClick={handleRequestVerification} variant="outline">
                Request Verification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public seller profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={mockSeller.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {mockSeller.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell buyers about yourself and your products..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="min-h-[100px] bg-background"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram (optional)</Label>
                <Input
                  id="telegram"
                  placeholder="@username"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Seller Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">{mockSeller.totalSales}</p>
              <p className="text-sm text-muted-foreground">Total Sales</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">${mockSeller.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">{mockSeller.rating}</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">
                {new Date(mockSeller.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
              <p className="text-sm text-muted-foreground">Member Since</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 gradient-btn-primary text-white">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
