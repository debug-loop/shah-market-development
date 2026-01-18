import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send, Plus, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sectionService, adminSectionService, productService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';

interface Section {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  attributeSchema?: any;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  sectionId: string;
}

interface BulkPriceTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const isEditMode = !!id;

  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isApprovedProduct, setIsApprovedProduct] = useState(false);
  const [editConfirmed, setEditConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    sectionId: '',
    categoryId: '',
    productName: '',
    description: '',
    price: '',
    bulkPricing: [] as BulkPriceTier[],
    inventoryType: 'unlimited' as 'unlimited' | 'limited',
    quantity: '',
    deliveryType: 'instant' as 'instant' | '1-6h' | '12h' | '24h' | 'custom',
    customDeliveryTime: '',
    replacementAvailable: false,
    replacementDuration: '',
    attributes: {} as any,
    images: [] as string[],
  });

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    fetchSections();
    if (isEditMode) {
      fetchProduct();
    }
  }, [isEditMode, id]);

  useEffect(() => {
    if (formData.sectionId) {
      fetchCategories(formData.sectionId);
      const section = sections.find(s => s._id === formData.sectionId);
      setSelectedSection(section || null);
    }
  }, [formData.sectionId, sections]);

  const fetchSections = async () => {
    try {
      const response = await sectionService.getAll();
      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load sections',
        variant: 'destructive',
      });
    }
  };

  const fetchCategories = async (sectionId: string) => {
    try {
      const response = await sectionService.getCategories(sectionId);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id!);
      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          sectionId: product.sectionId,
          categoryId: product.categoryId,
          productName: product.productName,
          description: product.description,
          price: product.price.toString(),
          bulkPricing: product.bulkPricing || [],
          inventoryType: product.inventoryType,
          quantity: product.quantity?.toString() || '',
          deliveryType: product.deliveryType,
          customDeliveryTime: product.customDeliveryTime || '',
          replacementAvailable: product.replacementAvailable,
          replacementDuration: product.replacementDuration || '',
          attributes: product.attributes || {},
          images: product.images || [],
        });
        setIsApprovedProduct(product.status === 'approved');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load product',
        variant: 'destructive',
      });
    }
  };

  const handleAddBulkPriceTier = () => {
    setFormData({
      ...formData,
      bulkPricing: [
        ...formData.bulkPricing,
        { minQty: 1, maxQty: null, price: parseFloat(formData.price) || 0 },
      ],
    });
  };

  const handleRemoveBulkPriceTier = (index: number) => {
    setFormData({
      ...formData,
      bulkPricing: formData.bulkPricing.filter((_, i) => i !== index),
    });
  };

  const handleBulkPriceTierChange = (index: number, field: keyof BulkPriceTier, value: any) => {
    const updated = [...formData.bulkPricing];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, bulkPricing: updated });
  };

  const handleAttributeChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes,
        [key]: value,
      },
    });
  };

  const handleSubmit = async () => {
    if (!formData.sectionId || !formData.categoryId || !formData.productName || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (isEditMode && isApprovedProduct && !editConfirmed) {
      toast({
        title: 'Confirmation Required',
        description: 'Please confirm that you understand editing will require re-approval',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const productData = {
        sectionId: formData.sectionId,
        categoryId: formData.categoryId,
        productName: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price),
        bulkPricing: formData.bulkPricing,
        inventoryType: formData.inventoryType,
        quantity: formData.inventoryType === 'limited' ? parseInt(formData.quantity) : 999999,
        deliveryType: formData.deliveryType,
        customDeliveryTime: formData.customDeliveryTime,
        replacementAvailable: formData.replacementAvailable,
        replacementDuration: formData.replacementDuration,
        images: formData.images,
        attributes: formData.attributes,
      };

      if (isEditMode) {
        await productService.update(id!, productData);
        toast({
          title: 'Product Updated',
          description: isApprovedProduct
            ? 'Product updated and sent for re-approval'
            : 'Product updated successfully',
        });
      } else {
        await productService.create(productData);
        toast({
          title: 'Product Created',
          description: 'Product created and sent for approval',
        });
      }

      navigate('/seller/products');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderAttributeField = (key: string, config: any) => {
    const { type, label, options, required } = config;

    if (type === 'select') {
      return (
        <div key={key} className="space-y-2">
          <Label>
            {label || key} {required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={formData.attributes[key] || ''}
            onValueChange={(value) => handleAttributeChange(key, value)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={`Select ${label || key}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (type === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between py-2">
          <Label>{label || key}</Label>
          <Switch
            checked={formData.attributes[key] || false}
            onCheckedChange={(checked) => handleAttributeChange(key, checked)}
          />
        </div>
      );
    }

    if (type === 'string') {
      return (
        <div key={key} className="space-y-2">
          <Label>
            {label || key} {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            value={formData.attributes[key] || ''}
            onChange={(e) => handleAttributeChange(key, e.target.value)}
            placeholder={`Enter ${label || key}`}
            className="bg-background"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode ? 'Update your product listing' : 'Create a new product listing for your store'}
        </p>
      </div>

      {/* Edit Warning */}
      {isEditMode && isApprovedProduct && (
        <Alert variant="default" className="border-warning">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription>
            <p className="font-semibold mb-2">Warning: Editing Approved Product</p>
            <p className="text-sm mb-3">
              Editing this approved product will send it back to pending status for admin re-approval.
              It will be hidden from the marketplace until approved again.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-confirm"
                checked={editConfirmed}
                onCheckedChange={(checked) => setEditConfirmed(checked as boolean)}
              />
              <Label htmlFor="edit-confirm" className="text-sm cursor-pointer">
                I understand and want to proceed
              </Label>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section */}
          <div className="space-y-2">
            <Label>
              Section <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.sectionId}
              onValueChange={(value) => {
                setFormData({ ...formData, sectionId: value, categoryId: '', attributes: {} });
                setCategories([]);
              }}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section._id} value={section._id}>
                    {section.icon} {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              disabled={!formData.sectionId}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="bg-background"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
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

      {/* Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Single Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price <span className="text-destructive">*</span>
            </Label>
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

          {/* Bulk Pricing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Bulk Pricing (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBulkPriceTier}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Tier
              </Button>
            </div>

            {formData.bulkPricing.map((tier, index) => (
              <div key={index} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/50">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs">Min Qty</Label>
                  <Input
                    type="number"
                    value={tier.minQty}
                    onChange={(e) =>
                      handleBulkPriceTierChange(index, 'minQty', parseInt(e.target.value))
                    }
                    className="bg-background"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs">Max Qty</Label>
                  <Input
                    type="number"
                    value={tier.maxQty || ''}
                    onChange={(e) =>
                      handleBulkPriceTierChange(
                        index,
                        'maxQty',
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    placeholder="Unlimited"
                    className="bg-background"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tier.price}
                    onChange={(e) =>
                      handleBulkPriceTierChange(index, 'price', parseFloat(e.target.value))
                    }
                    className="bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveBulkPriceTier(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Inventory Type */}
          <div className="space-y-3">
            <Label>Inventory Type</Label>
            <RadioGroup
              value={formData.inventoryType}
              onValueChange={(value) =>
                setFormData({ ...formData, inventoryType: value as 'unlimited' | 'limited' })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlimited" id="unlimited" />
                <Label htmlFor="unlimited" className="font-normal cursor-pointer">
                  Unlimited
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited" id="limited" />
                <Label htmlFor="limited" className="font-normal cursor-pointer">
                  Limited
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Stock Quantity */}
          {formData.inventoryType === 'limited' && (
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="bg-background"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Attributes */}
      {selectedSection?.attributeSchema && Object.keys(selectedSection.attributeSchema).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Attributes</CardTitle>
            <CardDescription>
              Specific attributes for {selectedSection.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(selectedSection.attributeSchema).map(([key, config]) =>
              renderAttributeField(key, config)
            )}
          </CardContent>
        </Card>
      )}

      {/* Delivery & Warranty */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery & Warranty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Delivery Type */}
          <div className="space-y-3">
            <Label>Delivery Time</Label>
            <RadioGroup
              value={formData.deliveryType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  deliveryType: value as typeof formData.deliveryType,
                })
              }
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instant" id="instant" />
                <Label htmlFor="instant" className="font-normal cursor-pointer">
                  Instant
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-6h" id="1-6h" />
                <Label htmlFor="1-6h" className="font-normal cursor-pointer">
                  1-6 hours
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h" className="font-normal cursor-pointer">
                  12 hours
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h" className="font-normal cursor-pointer">
                  24 hours
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Custom
                </Label>
              </div>
            </RadioGroup>

            {formData.deliveryType === 'custom' && (
              <Input
                placeholder="e.g., 2-3 business days"
                value={formData.customDeliveryTime}
                onChange={(e) => setFormData({ ...formData, customDeliveryTime: e.target.value })}
                className="bg-background"
              />
            )}
          </div>

          {/* Replacement Available */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label>Replacement Available?</Label>
              <p className="text-sm text-muted-foreground">
                Offer replacement if product doesn't work
              </p>
            </div>
            <Switch
              checked={formData.replacementAvailable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, replacementAvailable: checked })
              }
            />
          </div>

          {formData.replacementAvailable && (
            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor="replacementDuration">Replacement Duration</Label>
              <Input
                id="replacementDuration"
                placeholder="e.g., 24 hours, 7 days"
                value={formData.replacementDuration}
                onChange={(e) => setFormData({ ...formData, replacementDuration: e.target.value })}
                className="bg-background"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate('/seller/products')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="gap-2">
          {loading ? (
            'Saving...'
          ) : (
            <>
              <Send className="h-4 w-4" />
              {isEditMode ? 'Update Product' : 'Submit for Approval'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
