import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Plus, Edit, Trash2, GripVertical, Save, X, Filter } from 'lucide-react';
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
import { adminCategoryService, adminSectionService } from '@/api/services';

interface Section {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order: number;
  isActive: boolean;
  sectionId: Section;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  sectionId: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  isActive: boolean;
}

export default function AdminCategories() {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filterSection, setFilterSection] = useState<string>('all');
  const [formData, setFormData] = useState<CategoryFormData>({
    sectionId: '',
    name: '',
    icon: '',
    description: '',
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchSections();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filterSection === 'all') {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((cat) => cat.sectionId._id === filterSection)
      );
    }
  }, [filterSection, categories]);

  const fetchSections = async () => {
    try {
      const response = await adminSectionService.getAll({ status: 'active' });
      if (response.data.success) {
        setSections(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (error: any) {
      console.error('Failed to fetch sections:', error);
      setSections([]);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminCategoryService.getAll();
      if (response.data.success) {
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        sectionId: category.sectionId._id,
        name: category.name,
        icon: category.icon,
        description: category.description,
        order: category.order,
        isActive: category.isActive,
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        sectionId: filterSection !== 'all' ? filterSection : '',
        name: '',
        icon: '',
        description: '',
        order: 1,
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sectionId) {
      toast({
        title: 'Error',
        description: 'Please select a section',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedCategory) {
        await adminCategoryService.update(selectedCategory._id, formData);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await adminCategoryService.create(formData);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }

      handleCloseDialog();
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await adminCategoryService.delete(selectedCategory._id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await adminCategoryService.update(category._id, {
        isActive: !category.isActive,
      });
      toast({
        title: 'Success',
        description: `Category ${!category.isActive ? 'activated' : 'deactivated'}`,
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
            <p className="text-muted-foreground">Manage categories within marketplace sections</p>
          </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
              <CardDescription>Configure categories for each marketplace section</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section._id} value={section._id}>
                      {section.icon} {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filterSection === 'all'
                ? 'No categories found. Create your first category to get started.'
                : 'No categories in this section.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Section</TableHead>
                    <TableHead className="hidden lg:table-cell">Slug</TableHead>
                    <TableHead className="hidden lg:table-cell">Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-medium">{category.order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-2xl">{category.icon}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground hidden sm:block">
                            {category.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {category.sectionId.icon} {category.sectionId.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary">{category.productCount || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleActive(category)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(category)}
                            disabled={category.productCount && category.productCount > 0}
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? 'Update category details'
                : 'Create a new category within a marketplace section'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sectionId">Section *</Label>
                <Select
                  value={formData.sectionId}
                  onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                  required
                >
                  <SelectTrigger id="sectionId">
                    <SelectValue placeholder="Select a section" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Gmail"
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
                  placeholder="Gmail accounts marketplace"
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {selectedCategory ? 'Update' : 'Create'}
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
              This will permanently delete the category "{selectedCategory?.name}".
              {selectedCategory?.productCount && selectedCategory.productCount > 0
                ? ' This category has products and cannot be deleted.'
                : ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={selectedCategory?.productCount && selectedCategory.productCount > 0}
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
