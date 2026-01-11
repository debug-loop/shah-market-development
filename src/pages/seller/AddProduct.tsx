import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productCategories, deliveryTimeOptions } from '@/data/mockSellerData';
import { useToast } from '@/hooks/use-toast';
import type { ProductCategory, DeliveryTime } from '@/types/seller';

export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    category: '' as ProductCategory,
    name: '',
    description: '',
    price: '',
    currency: 'USD' as 'USD' | 'USDT',
    deliveryTime: 'instant' as DeliveryTime,
    customDeliveryTime: '',
    quantity: '',
    isUnlimited: false,
    hasReplacement: false,
    replacementDuration: '',
    replacementConditions: '',
  });

  const handleSubmit = (isDraft: boolean) => {
    // TODO: Connect to Express.js backend
    // POST /api/seller/products
    // Body: { ...formData, status: isDraft ? 'draft' : 'pending' }
    
    console.log('Submitting product:', { ...formData, isDraft });
    
    toast({
      title: isDraft ? 'Draft Saved' : 'Product Submitted',
      description: isDraft 
        ? 'Your product has been saved as a draft.'
        : 'Your product has been submitted for approval.',
    });
    
    navigate('/seller/products/pending');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product listing for your store</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ProductCategory })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {productCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[120px] bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Asking Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-background"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <RadioGroup
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value as 'USD' | 'USDT' })}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USD" id="usd" />
                  <Label htmlFor="usd" className="font-normal cursor-pointer">USD ($)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USDT" id="usdt" />
                  <Label htmlFor="usdt" className="font-normal cursor-pointer">USDT (₮)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Delivery & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Time */}
          <div className="space-y-2">
            <Label>Delivery Time</Label>
            <RadioGroup
              value={formData.deliveryTime}
              onValueChange={(value) => setFormData({ ...formData, deliveryTime: value as DeliveryTime })}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {deliveryTimeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {formData.deliveryTime === 'custom' && (
              <Input
                placeholder="e.g., 2-3 business days"
                value={formData.customDeliveryTime}
                onChange={(e) => setFormData({ ...formData, customDeliveryTime: e.target.value })}
                className="mt-3 bg-background"
              />
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quantity">Supply Quantity</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unlimited"
                  checked={formData.isUnlimited}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isUnlimited: checked as boolean })
                  }
                />
                <Label htmlFor="unlimited" className="font-normal cursor-pointer">
                  Unlimited
                </Label>
              </div>
            </div>
            {!formData.isUnlimited && (
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="bg-background"
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Replacement / Warranty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Replacement Available?</Label>
              <p className="text-sm text-muted-foreground">
                Offer replacement if product doesn't work
              </p>
            </div>
            <Switch
              checked={formData.hasReplacement}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, hasReplacement: checked })
              }
            />
          </div>

          {formData.hasReplacement && (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <Label htmlFor="replacementDuration">Replacement Duration</Label>
                <Input
                  id="replacementDuration"
                  placeholder="e.g., 24 hours, 7 days"
                  value={formData.replacementDuration}
                  onChange={(e) => setFormData({ ...formData, replacementDuration: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replacementConditions">Replacement Conditions</Label>
                <Textarea
                  id="replacementConditions"
                  placeholder="Describe the conditions for replacement..."
                  value={formData.replacementConditions}
                  onChange={(e) => setFormData({ ...formData, replacementConditions: e.target.value })}
                  className="min-h-[100px] bg-background"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => handleSubmit(true)}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          className="gap-2 gradient-btn-primary text-white"
        >
          <Send className="h-4 w-4" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
