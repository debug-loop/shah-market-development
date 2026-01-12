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
import { useToast } from '@/hooks/use-toast';
import { Package, Check, X, DollarSign, Tag, User, Truck } from 'lucide-react';

// Mock pending products
const mockProducts = [
  {
    _id: '1',
    productName: 'Premium WordPress Theme',
    description: 'A beautiful and responsive WordPress theme suitable for any business or portfolio website.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400'],
    categoryId: { name: 'Web Templates' },
    sellerId: { fullName: 'John Designer' },
    deliveryType: 'Instant',
    status: 'pending',
  },
  {
    _id: '2',
    productName: 'Mobile App UI Kit',
    description: 'Complete UI kit for iOS and Android apps with over 200 screens and components.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'],
    categoryId: { name: 'UI Kits' },
    sellerId: { fullName: 'Sarah Creative' },
    deliveryType: '24 Hours',
    status: 'pending',
  },
  {
    _id: '3',
    productName: 'SEO Services Package',
    description: 'Complete SEO audit and optimization package for small to medium businesses.',
    price: 299.99,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
    categoryId: { name: 'Digital Marketing' },
    sellerId: { fullName: 'Mike SEO Pro' },
    deliveryType: '7 Days',
    status: 'pending',
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Simulate API call - replace with adminService.getPendingProducts()
      await new Promise(resolve => setTimeout(resolve, 300));
      setProducts(mockProducts);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    try {
      // Replace with adminService.approveProduct(productId)
      setProducts(products.filter(p => p._id !== productId));
      toast({
        title: 'Product Approved',
        description: 'The product has been approved and is now live.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to approve product.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || !selectedProduct) {
      toast({
        title: 'Error',
        description: 'Please enter a rejection reason.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Replace with adminService.rejectProduct(selectedProduct, { rejectionReason })
      setProducts(products.filter(p => p._id !== selectedProduct));
      toast({
        title: 'Product Rejected',
        description: 'The product has been rejected and the seller has been notified.',
      });
      setRejectDialogOpen(false);
      setSelectedProduct(null);
      setRejectionReason('');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to reject product.',
        variant: 'destructive',
      });
    }
  };

  const openRejectDialog = (productId: string) => {
    setSelectedProduct(productId);
    setRejectDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6" />
            Pending Products
          </h1>
          <p className="text-muted-foreground">Review and approve or reject product submissions</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Pending Products</h3>
              <p className="text-muted-foreground">All product submissions have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="glass-card overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 status-pending">
                    Pending Review
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{product.productName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-medium">${product.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="truncate">{product.categoryId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{product.sellerId?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{product.deliveryType}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={() => handleApprove(product._id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => openRejectDialog(product._id)}
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
              <DialogTitle>Reject Product</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this product. The seller will be notified.
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
