import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Package } from 'lucide-react';
import { sectionService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  order: number;
  productCount?: number;
}

interface Section {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export default function SectionView() {
  const { sectionSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [section, setSection] = useState<Section | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (sectionSlug) {
      fetchSectionAndCategories();
    }
  }, [sectionSlug]);

  const fetchSectionAndCategories = async () => {
    try {
      setLoading(true);

      // Fetch all sections to find the current one
      const sectionsResponse = await sectionService.getAll();
      if (sectionsResponse.data.success) {
        const currentSection = sectionsResponse.data.data.find(
          (s: Section) => s.slug === sectionSlug
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

        // Fetch categories for this section
        const categoriesResponse = await sectionService.getCategories(currentSection._id);
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load section',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    if (categorySlug === 'all') {
      setSelectedCategory('all');
    } else {
      navigate(`/marketplace/${sectionSlug}/${categorySlug}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!section) {
    return null;
  }

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
        <div className="text-sm text-muted-foreground">
          Marketplace &gt; {section.name}
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-5xl">{section.icon}</div>
          <div>
            <h1 className="text-3xl font-bold">{section.name}</h1>
            {section.description && (
              <p className="text-muted-foreground mt-1">{section.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No categories available in this section</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Categories Tabs */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full justify-start flex-wrap h-auto">
                  <TabsTrigger
                    value="all"
                    onClick={() => handleCategoryClick('all')}
                    className="flex items-center gap-2"
                  >
                    All ({totalProducts})
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category._id}
                      value={category.slug}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="flex items-center gap-2"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                      <span className="text-xs text-muted-foreground">({category.productCount || 0})</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/marketplace/${sectionSlug}/${category.slug}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-4xl">{category.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {category.description}
                    </p>
                  )}
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    {category.productCount || 0} products
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
