import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import { sectionService, productService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import FilterPanel from '@/components/marketplace/FilterPanel';
import MarketplaceProductCard from '@/components/cards/MarketplaceProductCard';

interface Product {
  _id: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  quantity: number;
  bulkPricing?: Array<{ minQty: number; maxQty: number | null; price: number }>;
  attributes?: any;
}

export default function ProductListing() {
  const { sectionSlug, categorySlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [section, setSection] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [sectionSlug, categorySlug, filters, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch sections to get section and category info
      const sectionsResponse = await sectionService.getAll();
      if (sectionsResponse.data.success) {
        const currentSection = sectionsResponse.data.data.find(
          (s: any) => s.slug === sectionSlug
        );

        if (!currentSection) {
          toast({
            title: 'Error',
            description: 'Section not found',
            variant: 'destructive',
          });
          navigate('/marketplace');
          return;
        }

        setSection(currentSection);

        // Fetch categories
        const categoriesResponse = await sectionService.getCategories(currentSection._id);
        if (categoriesResponse.data.success) {
          const currentCategory = categoriesResponse.data.data.find(
            (c: any) => c.slug === categorySlug
          );

          if (!currentCategory) {
            toast({
              title: 'Error',
              description: 'Category not found',
              variant: 'destructive',
            });
            navigate(`/marketplace/${sectionSlug}`);
            return;
          }

          setCategory(currentCategory);

          // Fetch products
          const productParams: any = {
            sectionId: currentSection._id,
            categoryId: currentCategory._id,
            ...filters,
          };

          const productsResponse = await productService.getAll(productParams);
          if (productsResponse.data.success) {
            let fetchedProducts = productsResponse.data.data;

            // Sort products
            if (sortBy === 'price-low') {
              fetchedProducts.sort((a: Product, b: Product) => a.price - b.price);
            } else if (sortBy === 'price-high') {
              fetchedProducts.sort((a: Product, b: Product) => b.price - a.price);
            } else if (sortBy === 'rating') {
              fetchedProducts.sort((a: Product, b: Product) => b.rating - a.rating);
            }

            setProducts(fetchedProducts);
          }
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!section || !category) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/marketplace/${sectionSlug}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {section.name}
        </Button>
        <div className="text-sm text-muted-foreground">
          Marketplace &gt; {section.name} &gt; {category.name}
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">{category.icon}</div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-4">
            <FilterPanel
              attributeSchema={section.attributeSchema}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Products Area */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel
                      attributeSchema={section.attributeSchema}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <MarketplaceProductCard
                  key={product._id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
