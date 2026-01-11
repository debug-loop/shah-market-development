import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { mockProducts, productCategories } from '@/data/mockSellerData';
import type { ProductStatus } from '@/types/seller';

function getStatusStyles(status: ProductStatus) {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'draft':
      return 'bg-muted text-muted-foreground border-muted';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusLabel(status: ProductStatus) {
  switch (status) {
    case 'approved':
      return '🟢 Live';
    case 'pending':
      return '🟡 Pending';
    case 'rejected':
      return '🔴 Rejected';
    case 'draft':
      return '⚪ Draft';
    default:
      return status;
  }
}

export default function MyProducts() {
  const { status } = useParams<{ status?: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Filter products based on route
  const filteredProducts = status
    ? mockProducts.filter((p) => p.status === status)
    : mockProducts;

  const pageTitle = status
    ? `${status.charAt(0).toUpperCase() + status.slice(1)} Products`
    : 'My Products';

  const getCategoryLabel = (value: string) => {
    return productCategories.find((c) => c.value === value)?.label || value;
  };

  const handleDelete = (id: string) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Connect to Express.js backend
    // DELETE /api/seller/products/{selectedProductId}
    console.log('Deleting product:', selectedProductId);
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button asChild className="gradient-btn-primary text-white">
          <Link to="/seller/add-product">Add New Product</Link>
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Product Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-medium line-clamp-1">{product.name}</span>
                          {product.status === 'rejected' && product.rejectionReason && (
                            <p className="text-xs text-destructive mt-1 line-clamp-1">
                              Reason: {product.rejectionReason}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {getCategoryLabel(product.category)}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {product.currency === 'USDT' ? '₮' : '$'}
                        {product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className={getStatusStyles(product.status)}>
                          {getStatusLabel(product.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
