import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, MoreVertical, Plus, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { productService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  soldCount: number;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  isEdited: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  sectionId: { name: string; icon: string };
  categoryId: { name: string };
}

export default function MyProducts() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('approved');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getSellerProducts();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;

    try {
      await productService.delete(selectedProductId);
      toast({
        title: 'Product Deleted',
        description: 'Product has been deleted successfully',
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  const filteredProducts = products.filter((p) => p.status === activeTab);
  const approvedCount = products.filter((p) => p.status === 'approved').length;
  const pendingCount = products.filter((p) => p.status === 'pending').length;
  const rejectedCount = products.filter((p) => p.status === 'rejected').length;

  const getStatusBadge = (product: Product) => {
    if (product.status === 'approved') {
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    }

    if (product.status === 'pending') {
      if (product.isEdited) {
        return (
          <Badge variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            EDITED - Pending
          </Badge>
        );
      }
      return (
        <Badge variant="default" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }

    if (product.status === 'rejected') {
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    }

    return null;
  };

  const renderProductRow = (product: Product) => {
    const canEdit = product.status !== 'pending' || !product.isEdited;
    const isRejected = product.status === 'rejected';

    return (
      <tr key={product._id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
        <td className="py-4 px-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {typeof product.sectionId === 'object' ? product.sectionId.icon : '📦'}
              </span>
              <span className="font-medium line-clamp-1">{product.productName}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {typeof product.sectionId === 'object' && product.sectionId.name} &gt;{' '}
              {typeof product.categoryId === 'object' && product.categoryId.name}
            </p>
            {isRejected && product.rejectionReason && (
              <Alert className="mt-2 p-2 border-destructive/50 bg-destructive/5">
                <AlertDescription className="text-xs text-destructive">
                  <strong>Reason:</strong> {product.rejectionReason}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="text-right">
            <div className="font-semibold text-lg">${product.price.toFixed(2)}</div>
            {product.status === 'approved' && (
              <>
                <div className="text-xs text-muted-foreground">Stock: {product.quantity}</div>
                <div className="text-xs text-muted-foreground">Sales: {product.soldCount}</div>
              </>
            )}
          </div>
        </td>
        <td className="py-4 px-6">{getStatusBadge(product)}</td>
        <td className="py-4 px-6">
          <div className="text-xs text-muted-foreground">
            {product.isEdited
              ? `Edited: ${new Date(product.updatedAt).toLocaleDateString()}`
              : `Created: ${new Date(product.createdAt).toLocaleDateString()}`}
          </div>
        </td>
        <td className="py-4 px-6 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/products/${product.productId}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {product.status === 'approved' && (
                <>
                  <DropdownMenuItem onClick={() => navigate(`/seller/products/${product._id}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="mr-2">📊</span>
                    View Analytics
                  </DropdownMenuItem>
                </>
              )}
              {product.status === 'rejected' && (
                <DropdownMenuItem onClick={() => navigate(`/seller/products/${product._id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit & Resubmit
                </DropdownMenuItem>
              )}
              {product.status !== 'approved' && (
                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product._id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-muted-foreground">Manage your product listings</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/seller/add-product">
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 gap-2">
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved
            {approvedCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {approvedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" />
            Rejected
            {rejectedCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {rejectedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                          Product
                        </th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                          Price & Stats
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-muted-foreground">
                            No {activeTab} products found
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(renderProductRow)
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onValueChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
