import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Plus, Edit, Trash2, GripVertical, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { adminSectionService } from '@/api/services';

interface Section {
  _id: string;
  sectionId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order: number;
  isActive: boolean;
  attributeSchema: any;
  categoryCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface AttributeField {
  key: string;
  label: string;
  type: 'select' | 'boolean' | 'string';
  options: string;
  required: boolean;
}

interface SectionFormData {
  name: string;
  icon: string;
  description: string;
  order: number;
  isActive: boolean;
}

export default function AdminSections() {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<SectionFormData>({
    name: '',
    icon: '',
    description: '',
    order: 1,
    isActive: true,
  });
  const [attributes, setAttributes] = useState<AttributeField[]>([
    { key: 'quality', label: 'Quality', type: 'select', options: 'new,old,fresh,aged', required: true },
    { key: 'country', label: 'Country', type: 'string', options: '', required: true },
  ]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await adminSectionService.getAll();
      if (response.data.success) {
        setSections(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (error: any) {
      console.error('Failed to fetch sections:', error);
      setSections([]);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load sections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (section?: Section) => {
    if (section) {
      setSelectedSection(section);
      setFormData({
        name: section.name,
        icon: section.icon,
        description: section.description,
        order: section.order,
        isActive: section.isActive,
      });

      // Convert existing attributeSchema to array format
      const attributeArray: AttributeField[] = [];
      if (section.attributeSchema && typeof section.attributeSchema === 'object') {
        Object.entries(section.attributeSchema).forEach(([key, value]: [string, any]) => {
          attributeArray.push({
            key,
            label: value.label || key,
            type: value.type || 'string',
            options: value.options ? value.options.join(',') : '',
            required: value.required || false,
          });
        });
      }
      setAttributes(attributeArray.length > 0 ? attributeArray : [
        { key: 'quality', label: 'Quality', type: 'select', options: 'new,old,fresh,aged', required: true },
      ]);
    } else {
      setSelectedSection(null);
      setFormData({
        name: '',
        icon: '',
        description: '',
        order: sections.length + 1,
        isActive: true,
      });
      setAttributes([
        { key: 'quality', label: 'Quality', type: 'select', options: 'new,old,fresh,aged', required: true },
        { key: 'country', label: 'Country', type: 'string', options: '', required: true },
      ]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSection(null);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', label: '', type: 'string', options: '', required: false }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: keyof AttributeField, value: any) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  const buildAttributeSchema = () => {
    const schema: any = {};
    attributes.forEach((attr) => {
      if (attr.key.trim()) {
        schema[attr.key.trim()] = {
          type: attr.type,
          label: attr.label.trim() || attr.key.trim(),
          required: attr.required,
        };

        if (attr.type === 'select' && attr.options.trim()) {
          schema[attr.key.trim()].options = attr.options.split(',').map(opt => opt.trim()).filter(opt => opt);
        }
      }
    });
    return schema;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate attributes
    const hasEmptyKeys = attributes.some(attr => !attr.key.trim());
    if (hasEmptyKeys) {
      toast({
        title: 'Error',
        description: 'All attributes must have a field name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const attributeSchema = buildAttributeSchema();
      const submitData = {
        ...formData,
        attributeSchema,
      };

      if (selectedSection) {
        await adminSectionService.update(selectedSection._id, submitData);
        toast({
          title: 'Success',
          description: 'Section updated successfully',
        });
      } else {
        await adminSectionService.create(submitData);
        toast({
          title: 'Success',
          description: 'Section created successfully',
        });
      }

      handleCloseDialog();
      fetchSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save section',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSection) return;

    try {
      await adminSectionService.delete(selectedSection._id);
      toast({
        title: 'Success',
        description: 'Section deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSelectedSection(null);
      fetchSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete section',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (section: Section) => {
    try {
      await adminSectionService.update(section._id, {
        isActive: !section.isActive,
      });
      toast({
        title: 'Success',
        description: `Section ${!section.isActive ? 'activated' : 'deactivated'}`,
      });
      fetchSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update section',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (section: Section) => {
    setSelectedSection(section);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Marketplace Sections</h1>
            <p className="text-muted-foreground">Manage marketplace sections and their attribute schemas</p>
          </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sections ({sections.length})</CardTitle>
          <CardDescription>Configure sections, icons, and dynamic attribute schemas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading sections...</div>
          ) : sections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sections found. Create your first section to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead className="hidden lg:table-cell">Categories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => (
                    <TableRow key={section._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-medium">{section.order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-2xl">{section.icon}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-sm text-muted-foreground hidden sm:block">
                            {section.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{section.slug}</code>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary">{section.categoryCount || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={section.isActive}
                          onCheckedChange={() => handleToggleActive(section)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(section)}
                            disabled={section.categoryCount && section.categoryCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSection ? 'Edit Section' : 'Create New Section'}</DialogTitle>
            <DialogDescription>
              {selectedSection
                ? 'Update section details and product attributes'
                : 'Create a new marketplace section with custom product attributes'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Section Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Email Accounts"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji) *</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📧"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Email account marketplace"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Product Attributes</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAttribute}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attribute
                  </Button>
                </div>

                <div className="space-y-3">
                  {attributes.map((attr, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
                        <div className="lg:col-span-3">
                          <Label className="text-xs">Field Name *</Label>
                          <Input
                            value={attr.key}
                            onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                            placeholder="quality"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div className="lg:col-span-3">
                          <Label className="text-xs">Label *</Label>
                          <Input
                            value={attr.label}
                            onChange={(e) => handleAttributeChange(index, 'label', e.target.value)}
                            placeholder="Quality"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={attr.type}
                            onValueChange={(value) => handleAttributeChange(index, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">Text</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="boolean">Yes/No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="lg:col-span-3">
                          <Label className="text-xs">Options (comma-separated)</Label>
                          <Input
                            value={attr.options}
                            onChange={(e) => handleAttributeChange(index, 'options', e.target.value)}
                            placeholder="new,old,fresh"
                            className="mt-1"
                            disabled={attr.type !== 'select'}
                          />
                        </div>
                        <div className="lg:col-span-1 flex items-end gap-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={attr.required}
                              onCheckedChange={(checked) => handleAttributeChange(index, 'required', checked)}
                            />
                            <Label className="text-xs">Required</Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttribute(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {attributes.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No attributes defined. Click "Add Attribute" to add product fields.
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {selectedSection ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the section "{selectedSection?.name}".
              {selectedSection?.categoryCount && selectedSection.categoryCount > 0
                ? ' This section has categories and cannot be deleted.'
                : ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={selectedSection?.categoryCount && selectedSection.categoryCount > 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </AdminDashboardLayout>
  );
}
