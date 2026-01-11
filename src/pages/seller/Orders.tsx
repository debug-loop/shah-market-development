import { useState } from 'react';
import { Eye, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockOrders } from '@/data/mockSellerData';
import type { Order, OrderStatus } from '@/types/seller';

function getStatusStyles(status: OrderStatus) {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'processing':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'disputed':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // TODO: Connect to Express.js backend
    // PUT /api/seller/orders/{orderId}/status
    // Body: { status: newStatus }
    console.log('Updating order status:', orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs bg-background"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-background">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Buyer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Qty</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-sm">{order.id}</td>
                      <td className="py-4 px-6">
                        <span className="line-clamp-1 max-w-[200px]">{order.productName}</span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{order.buyerName}</td>
                      <td className="py-4 px-6">{order.quantity}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className={getStatusStyles(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold">
                        {order.currency === 'USDT' ? '₮' : '$'}
                        {order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {order.status === 'pending' && (
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => handleUpdateStatus(order.id, 'processing')}
                              >
                                <Clock className="h-4 w-4" />
                                Mark Processing
                              </DropdownMenuItem>
                            )}
                            {(order.status === 'pending' || order.status === 'processing') && (
                              <>
                                <DropdownMenuItem 
                                  className="gap-2 text-green-500"
                                  onClick={() => handleUpdateStatus(order.id, 'completed')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2 text-destructive"
                                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
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

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusStyles(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Buyer</p>
                  <p>{selectedOrder.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p>{selectedOrder.quantity}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p>{selectedOrder.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">
                    {selectedOrder.currency === 'USDT' ? '₮' : '$'}
                    {selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
