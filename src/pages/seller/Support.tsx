import { useState } from 'react';
import { Send, HelpCircle, FileText, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  {
    question: 'How do I add a new product?',
    answer: 'Go to "Add Product" from the sidebar, fill in the product details including category, price, description, and delivery time, then submit for approval.',
  },
  {
    question: 'How long does product approval take?',
    answer: 'Most products are reviewed within 24-48 hours. Complex products or those requiring additional verification may take up to 72 hours.',
  },
  {
    question: 'What are the commission rates?',
    answer: 'Our standard commission is 5% on all sales. Sellers with monthly volume over $10,000 may qualify for reduced rates of 3-4%.',
  },
  {
    question: 'How do withdrawals work?',
    answer: 'You can request a withdrawal from your Earnings page. We support USDT (TRC-20/ERC-20), PayPal, and bank transfers. Processing takes 1-3 business days.',
  },
  {
    question: 'What happens if a buyer disputes an order?',
    answer: 'Disputes are reviewed by our admin team. You\'ll be notified and can provide evidence. Most disputes are resolved within 48 hours.',
  },
  {
    question: 'How can I get verified?',
    answer: 'Request verification from your Profile page. We may ask for additional documentation such as ID verification or proof of product sourcing.',
  },
];

export default function Support() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    priority: '',
    message: '',
  });

  const handleSubmit = () => {
    // TODO: Connect to Express.js backend
    // POST /api/seller/support/ticket
    // Body: formData
    
    console.log('Submitting support ticket:', formData);
    
    toast({
      title: 'Ticket Submitted',
      description: 'Your support ticket has been submitted. We\'ll respond within 24 hours.',
    });
    
    setFormData({ subject: '', priority: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get help with your seller account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Seller Guidelines
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Commission Policy
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="/seller/messages">
                  <MessageCircle className="h-4 w-4" />
                  Contact Admin
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submit Ticket */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Submit a Support Ticket
              </CardTitle>
              <CardDescription>
                Having an issue? Send us a ticket and we'll help you out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="low">Low - General question</SelectItem>
                      <SelectItem value="medium">Medium - Need assistance</SelectItem>
                      <SelectItem value="high">High - Urgent issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px] bg-background"
                />
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={!formData.subject || !formData.priority || !formData.message}
                className="gap-2 gradient-btn-primary text-white"
              >
                <Send className="h-4 w-4" />
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
