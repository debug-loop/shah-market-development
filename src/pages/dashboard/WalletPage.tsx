import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Clock, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { mockWallet, mockTransactions } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Available Balance"
            value={`$${mockWallet.availableBalance.toFixed(2)}`}
            icon={Wallet}
            iconColor="text-success"
          />
          <StatCard
            title="Pending Balance"
            value={`$${mockWallet.pendingBalance.toFixed(2)}`}
            icon={Clock}
            iconColor="text-warning"
          />
          <StatCard
            title="Total Spent"
            value={`$${mockWallet.totalSpent.toFixed(2)}`}
            icon={TrendingDown}
            iconColor="text-muted-foreground"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit Funds</DialogTitle>
                <DialogDescription>Add funds to your wallet using USDT</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="p-3 border rounded-lg bg-muted">
                    <p className="font-medium">USDT (TRC20)</p>
                    <p className="text-sm text-muted-foreground">Primary payment method</p>
                  </div>
                </div>
                <Button className="w-full">Proceed to Deposit</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>Withdraw your available balance</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Available to withdraw</p>
                  <p className="text-2xl font-bold">${mockWallet.availableBalance.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Amount (USD)</Label>
                  <Input id="withdrawAmount" type="number" placeholder="Enter amount" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">USDT Wallet Address (TRC20)</Label>
                  <Input id="walletAddress" placeholder="Enter your wallet address" />
                </div>
                <Button className="w-full">Request Withdrawal</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="secondary">
            <Wallet className="h-4 w-4 mr-2" />
            Use Balance
          </Button>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.amount > 0 ? (
                            <ArrowDownLeft className="h-4 w-4 text-success" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-destructive" />
                          )}
                          <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'font-medium',
                            tx.amount > 0 ? 'text-success' : 'text-destructive'
                          )}
                        >
                          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{tx.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            tx.status === 'completed' && 'status-completed',
                            tx.status === 'pending' && 'status-pending',
                            tx.status === 'failed' && 'status-cancelled'
                          )}
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}