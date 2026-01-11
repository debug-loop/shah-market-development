import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageSquare, AlertTriangle, Book, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'To place an order, browse our services, select the one you need, and click "Order Now". Follow the checkout process to complete your purchase.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We currently accept USDT (TRC20) as our primary payment method. More payment options will be available soon.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery time varies depending on the service. Each service listing shows the estimated delivery time. You can also check your order status in the Orders section.',
  },
  {
    question: 'How do I request a refund?',
    answer:
      'If you are unsatisfied with your order, you can file a dispute within 7 days of delivery. Our support team will review your case and process refunds if applicable.',
  },
  {
    question: 'How does the referral program work?',
    answer:
      'Share your unique referral link with friends. When they sign up and make their first purchase, you earn a commission. You can find your referral link in the Referral Program section.',
  },
];

export default function SupportPage() {
  const [ticketOpen, setTicketOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Ticket Submitted',
      description: 'Our support team will respond within 24 hours.',
    });
    setTicketOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-muted-foreground">Get help with your account and orders</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <HelpCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-medium">Help Center</h3>
              <p className="text-sm text-muted-foreground">Browse articles</p>
            </CardContent>
          </Card>

          <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium">Submit Ticket</h3>
                  <p className="text-sm text-muted-foreground">Contact support</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and our team will respond within 24 hours
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitTicket} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Order Issue</SelectItem>
                      <SelectItem value="payment">Payment Problem</SelectItem>
                      <SelectItem value="account">Account Issue</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID (optional)</Label>
                  <Input id="orderId" placeholder="e.g., ORD-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setTicketOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-warning" />
              <h3 className="font-medium">Order Dispute</h3>
              <p className="text-sm text-muted-foreground">Report an issue</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-medium">FAQs</h3>
              <p className="text-sm text-muted-foreground">Common questions</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Ticket Button */}
        <Button onClick={() => setTicketOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create New Support Ticket
        </Button>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}