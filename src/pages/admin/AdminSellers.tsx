import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { 
  UserCheck, 
  Check, 
  X, 
  Mail, 
  Briefcase, 
  Clock, 
  Package, 
  Tag,
  ExternalLink 
} from 'lucide-react';

// Mock pending sellers
const mockSellers = [
  {
    _id: '1',
    fullName: 'John Designer',
    email: 'john@designer.com',
    sellerType: 'Individual',
    yearsOfExperience: 5,
    dailySupplyQuantity: 10,
    selectedCategories: ['Web Templates', 'UI Kits'],
    workDescription: 'Professional web designer with expertise in creating modern, responsive websites and UI components.',
    portfolioLinks: ['https://johndoesigner.com', 'https://dribbble.com/johndesigner'],
    status: 'pending',
    createdAt: '2024-01-15',
  },
  {
    _id: '2',
    fullName: 'Creative Agency LLC',
    email: 'contact@creativeagency.com',
    sellerType: 'Agency',
    yearsOfExperience: 10,
    dailySupplyQuantity: 50,
    selectedCategories: ['Digital Marketing', 'Video Production', 'Graphic Design'],
    workDescription: 'Full-service creative agency offering comprehensive digital solutions for businesses of all sizes.',
    portfolioLinks: ['https://creativeagency.com'],
    status: 'pending',
    createdAt: '2024-01-14',
  },
  {
    _id: '3',
    fullName: 'Sarah Developer',
    email: 'sarah@developer.io',
    sellerType: 'Freelancer',
    yearsOfExperience: 3,
    dailySupplyQuantity: 5,
    selectedCategories: ['Mobile Apps', 'Web Development'],
    workDescription: 'Full-stack developer specializing in React Native and Node.js applications.',
    portfolioLinks: ['https://github.com/sarahdev', 'https://sarahdev.io'],
    status: 'pending',
    createdAt: '2024-01-13',
  },
];

export default function AdminSellers() {
  const [sellers, setSellers] = useState(mockSellers);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      // Simulate API call - replace with adminService.getPendingSellers()
      await new Promise(resolve => setTimeout(resolve, 300));
      setSellers(mockSellers);
    } catch (err) {
      console.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      // Replace with adminService.approveSeller(sellerId)
      setSellers(sellers.filter(s => s._id !== sellerId));
      toast({
        title: 'Seller Approved',
        description: 'The seller has been approved and can now list products.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to approve seller.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || !selectedSeller) {
      toast({
        title: 'Error',
        description: 'Please enter a rejection reason.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Replace with adminService.rejectSeller(selectedSeller, { rejectionReason })
      setSellers(sellers.filter(s => s._id !== selectedSeller));
      toast({
        title: 'Seller Rejected',
        description: 'The seller has been rejected and notified.',
      });
      setRejectDialogOpen(false);
      setSelectedSeller(null);
      setRejectionReason('');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to reject seller.',
        variant: 'destructive',
      });
    }
  };

  const openRejectDialog = (sellerId: string) => {
    setSelectedSeller(sellerId);
    setRejectDialogOpen(true);
  };

  const getSellerTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Individual: 'bg-primary/10 text-primary border-primary/20',
      Agency: 'bg-accent/10 text-accent border-accent/20',
      Freelancer: 'bg-success/10 text-success border-success/20',
    };
    return (
      <Badge variant="outline" className={colors[type] || colors.Individual}>
        {type}
      </Badge>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            Pending Seller Applications
          </h1>
          <p className="text-muted-foreground">Review and approve or reject seller applications</p>
        </div>

        {/* Sellers List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : sellers.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Pending Applications</h3>
              <p className="text-muted-foreground">All seller applications have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sellers.map((seller) => (
              <Card key={seller._id} className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{seller.fullName}</CardTitle>
                      {getSellerTypeBadge(seller.sellerType)}
                    </div>
                    <Badge variant="outline" className="status-pending w-fit">
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact & Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{seller.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{seller.yearsOfExperience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{seller.dailySupplyQuantity} units/day</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Applied {new Date(seller.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Categories</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {seller.selectedCategories.map((category, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Work Description */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Work Description</p>
                    <p className="text-sm">{seller.workDescription}</p>
                  </div>

                  {/* Portfolio Links */}
                  {seller.portfolioLinks && seller.portfolioLinks.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Portfolio Links</p>
                      <div className="flex flex-wrap gap-2">
                        {seller.portfolioLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {new URL(link).hostname}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-success hover:bg-success/90">
                          <Check className="h-4 w-4 mr-1" />
                          Approve Seller
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Seller Application</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to approve {seller.fullName}? They will be able to list products on the marketplace.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleApprove(seller._id)}
                            className="bg-success hover:bg-success/90"
                          >
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button 
                      variant="destructive"
                      onClick={() => openRejectDialog(seller._id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Seller Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this application. The seller will be notified.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}
