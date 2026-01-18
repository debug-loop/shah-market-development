import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package } from 'lucide-react';
import { sectionService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';

interface Section {
  _id: string;
  sectionId: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  order: number;
  isActive: boolean;
  categoryCount?: number;
}

export default function Marketplace() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await sectionService.getAll();
      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load marketplace sections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Shah Marketplace</h1>
        <p className="text-muted-foreground text-lg">
          Browse digital accounts by category
        </p>
      </div>

      {/* Sections Grid */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No sections available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => (
            <Card
              key={section._id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/marketplace/${section.slug}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-5xl">{section.icon}</div>
                </div>
                <CardTitle className="text-center text-xl group-hover:text-primary transition-colors">
                  {section.name}
                </CardTitle>
                {section.description && (
                  <CardDescription className="text-center">
                    {section.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {section.categoryCount || 0} {section.categoryCount === 1 ? 'category' : 'categories'}
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Browse →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
