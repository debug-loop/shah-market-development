import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { AlertTriangle, CheckCircle, XCircle, Eye, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/api/services';

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productChanges, setProductChanges] = useState(null);
  const [viewChangesId, setViewChangesId] = useState(null);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingProducts();
      setProducts(res.data.data?.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
      toast({
        title: 'Error',
        description: 'Failed to load pending products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductChanges = async (productId) => {
    try {
      setLoadingChanges(true);
      const res = await adminService.getProductChanges(productId);
      if (res.data.success) {
        setProductChanges(res.data.data);
        setViewChangesId(productId);
      }
    } catch (err) {
      console.error('Failed to fetch changes:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to load product changes',
        variant: 'destructive',
      });
    } finally {
      setLoadingChanges(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProduct) return;

    try {
      await adminService.approveProduct(selectedProduct._id, {
        adminNotes: adminNotes.trim() || undefined,
      });
      toast({
        title: 'Success',
        description: 'Product approved successfully',
      });
      setApproveDialogOpen(false);
      setSelectedProduct(null);
      setAdminNotes('');
      fetchProducts();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to approve product',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;

    if (!rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a rejection reason',
        variant: 'destructive',
      });
      return;
    }

    try {
      await adminService.rejectProduct(selectedProduct._id, {
        rejectionReason: rejectionReason.trim(),
      });
      toast({
        title: 'Success',
        description: 'Product rejected',
      });
      setRejectDialogOpen(false);
      setSelectedProduct(null);
      setRejectionReason('');
      fetchProducts();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to reject product',
        variant: 'destructive',
      });
    }
  };

  const openApproveDialog = (product) => {
    setSelectedProduct(product);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (product) => {
    setSelectedProduct(product);
    setRejectDialogOpen(true);
  };

  const renderChangeValue = (value) => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">-</span>;
    if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderDiffRow = (change) => {
    const hasChanged = change.old !== change.new;
    return (
      <div key={change.field} className={`grid grid-cols-3 gap-4 py-2 border-b ${hasChanged ? 'bg-yellow-50' : ''}`}>
        <div className="font-medium text-sm">{change.field}</div>
        <div className="text-sm">
          <span className={hasChanged ? 'line-through text-red-600' : ''}>
            {renderChangeValue(change.old)}
          </span>
        </div>
        <div className="text-sm">
          <span className={hasChanged ? 'text-green-600 font-medium' : ''}>
            {renderChangeValue(change.new)}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading pending products...</div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Products</h1>
          <p className="text-muted-foreground">Review and approve products from sellers</p>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No pending products to review</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <Card key={product._id} className={product.isEdited ? 'border-amber-300' : ''}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{product.productName}</CardTitle>
                        {product.isEdited && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            EDITED
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        onClick={() => openApproveDialog(product)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        onClick={() => openRejectDialog(product)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Collapsible
                    open={expandedProduct === product._id}
                    onOpenChange={(open) => setExpandedProduct(open ? product._id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between">
                        <span>Product Details</span>
                        {expandedProduct === product._id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      {/* Product Image */}
                      {product.images && product.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {product.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${product.productName} ${idx + 1}`}
                              className="h-32 w-32 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}

                      {/* Product Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Price</span>
                          <p className="font-medium">${product.price}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Category</span>
                          <p className="font-medium">{product.categoryId?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Section</span>
                          <p className="font-medium">
                            {product.sectionId?.icon} {product.sectionId?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Seller</span>
                          <p className="font-medium">{product.sellerId?.fullName || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Stock</span>
                          <p className="font-medium">
                            {product.inventoryType === 'unlimited' ? '∞ Unlimited' : product.quantity}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Delivery</span>
                          <p className="font-medium">{product.deliveryType}</p>
                        </div>
                      </div>

                      {/* Bulk Pricing */}
                      {product.bulkPricing && product.bulkPricing.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Bulk Pricing</h4>
                          <div className="space-y-1">
                            {product.bulkPricing.map((tier, idx) => (
                              <div key={idx} className="text-sm text-muted-foreground">
                                {tier.minQty} - {tier.maxQty || '∞'} units: ${tier.price} each
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Product Attributes */}
                      {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Product Attributes</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <Badge key={key} variant="outline">
                                {key}: {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View Changes Button for Edited Products */}
                      {product.isEdited && (
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProductChanges(product._id)}
                            disabled={loadingChanges}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {viewChangesId === product._id ? 'Hide Changes' : 'View Changes'}
                          </Button>

                          {/* Changes Diff View */}
                          {viewChangesId === product._id && productChanges && (
                            <div className="mt-4 border rounded-lg p-4 bg-muted/30">
                              <h4 className="font-medium mb-3 text-sm">Changes Made by Seller</h4>
                              <div className="bg-white rounded border">
                                <div className="grid grid-cols-3 gap-4 py-2 px-4 bg-muted font-medium text-sm border-b">
                                  <div>Field</div>
                                  <div>Previous Value</div>
                                  <div>New Value</div>
                                </div>
                                <div className="px-4">
                                  {productChanges.changes && productChanges.changes.length > 0 ? (
                                    productChanges.changes.map((change) => renderDiffRow(change))
                                  ) : (
                                    <div className="py-4 text-center text-sm text-muted-foreground">
                                      No changes detected
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approve Dialog */}
        <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve "{selectedProduct?.productName}"?
                {selectedProduct?.isEdited && ' This product has been edited by the seller.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="adminNotes" className="text-sm">Admin Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any internal notes about this approval..."
                rows={3}
                className="mt-2"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAdminNotes('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Product</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting "{selectedProduct?.productName}".
                The seller will see this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="rejectionReason" className="text-sm">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this product is being rejected..."
                rows={3}
                className="mt-2"
                required
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectionReason('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminDashboardLayout>
  );
}
