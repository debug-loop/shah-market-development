import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, DollarSign, Wallet, Copy, Check } from 'lucide-react';
import { mockReferral } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockReferral.referralLink);
    setCopied(true);
    toast({
      title: 'Link copied!',
      description: 'Referral link has been copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">Earn rewards by inviting friends</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Referrals"
            value={mockReferral.totalReferrals}
            icon={Users}
            iconColor="text-primary"
          />
          <StatCard
            title="Total Earnings"
            value={`$${mockReferral.totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatCard
            title="Withdrawable Balance"
            value={`$${mockReferral.withdrawableBalance.toFixed(2)}`}
            icon={Wallet}
            iconColor="text-accent"
          />
        </div>

        {/* Referral Link */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share your unique referral link with friends. You'll earn rewards when they sign up and make their first purchase.
            </p>
            <div className="flex gap-2">
              <Input
                value={mockReferral.referralLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Referral Link
              </Button>
              <Button variant="outline">
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw Earnings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-lg font-bold">
                  1
                </div>
                <h3 className="font-medium">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">
                  Copy and share your unique referral link with friends
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-lg font-bold">
                  2
                </div>
                <h3 className="font-medium">Friends Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  When they register using your link, they become your referral
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-lg font-bold">
                  3
                </div>
                <h3 className="font-medium">Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Get commission when your referrals make purchases
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}