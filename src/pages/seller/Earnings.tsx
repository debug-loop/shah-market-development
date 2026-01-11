import { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEarnings } from '@/data/mockSellerData';
import { useToast } from '@/hooks/use-toast';

export default function Earnings() {
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleWithdraw = () => {
    // TODO: Connect to Express.js backend
    // POST /api/seller/earnings/withdraw
    // Body: { amount: withdrawAmount, method: withdrawMethod, details: withdrawDetails }
    
    console.log('Withdrawal request:', { withdrawAmount, withdrawMethod, withdrawDetails });
    
    toast({
      title: 'Withdrawal Requested',
      description: `Your withdrawal of $${withdrawAmount} has been submitted for processing.`,
    });
    
    setDialogOpen(false);
    setWithdrawAmount('');
    setWithdrawMethod('');
    setWithdrawDetails('');
  };

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${mockEarnings.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Available Balance',
      value: `$${mockEarnings.availableBalance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pending Balance',
      value: `$${mockEarnings.pendingBalance.toLocaleString()}`,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'This Month',
      value: `$${mockEarnings.thisMonthEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">Track your earnings and request withdrawals</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-btn-primary text-white">
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Available: ${mockEarnings.availableBalance.toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="usdt-trc20">USDT (TRC-20)</SelectItem>
                    <SelectItem value="usdt-erc20">USDT (ERC-20)</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Wallet/Account Details</Label>
                <Input
                  placeholder="Enter wallet address or account details"
                  value={withdrawDetails}
                  onChange={(e) => setWithdrawDetails(e.target.value)}
                  className="bg-background"
                />
              </div>
              
              <Button 
                onClick={handleWithdraw}
                className="w-full gradient-btn-primary text-white"
                disabled={!withdrawAmount || !withdrawMethod || !withdrawDetails}
              >
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Comparison</p>
              <p className="text-lg font-semibold mt-1">
                This month: ${mockEarnings.thisMonthEarnings.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">vs Last Month</p>
              <div className="flex items-center gap-1 mt-1">
                {mockEarnings.thisMonthEarnings >= mockEarnings.lastMonthEarnings ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={mockEarnings.thisMonthEarnings >= mockEarnings.lastMonthEarnings ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(((mockEarnings.thisMonthEarnings - mockEarnings.lastMonthEarnings) / mockEarnings.lastMonthEarnings) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEarnings.transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'sale' ? 'bg-green-500/10' : tx.type === 'withdrawal' ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
                    {tx.type === 'sale' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : tx.type === 'withdrawal' ? (
                      <ArrowDownRight className="h-4 w-4 text-blue-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.orderId ? `Order: ${tx.orderId}` : new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.amount >= 0 ? 'text-green-500' : 'text-foreground'}`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.currency === 'USDT' ? '₮' : '$'}{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={
                      tx.status === 'completed' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : tx.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
