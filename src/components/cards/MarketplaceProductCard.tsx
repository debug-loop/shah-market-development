import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Package, CheckCircle2, Shield, Mail, Globe } from 'lucide-react';

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
  attributes?: {
    quality?: string;
    twoFa?: boolean;
    emailAccess?: boolean;
    recovery?: boolean;
    verified?: boolean;
    country?: string;
    [key: string]: any;
  };
  categoryId?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function MarketplaceProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.productId}`);
  };

  // Get the lowest bulk price if available
  const bulkPrice = product.bulkPricing && product.bulkPricing.length > 0
    ? Math.min(...product.bulkPricing.map(bp => bp.price))
    : null;

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  // Get attribute badges (max 4 visible)
  const getAttributeBadges = () => {
    const badges: { label: string; icon?: any; variant: string }[] = [];

    if (product.attributes) {
      // Quality badge
      if (product.attributes.quality) {
        badges.push({
          label: product.attributes.quality,
          variant: 'default',
        });
      }

      // 2FA badge
      if (product.attributes.twoFa) {
        badges.push({
          label: '2FA',
          icon: <Shield className="h-3 w-3" />,
          variant: 'success',
        });
      }

      // Email Access badge
      if (product.attributes.emailAccess) {
        badges.push({
          label: 'Mail Access',
          icon: <Mail className="h-3 w-3" />,
          variant: 'success',
        });
      }

      // Verified badge
      if (product.attributes.verified) {
        badges.push({
          label: 'Verified',
          icon: <CheckCircle2 className="h-3 w-3" />,
          variant: 'success',
        });
      }

      // Country badge
      if (product.attributes.country) {
        badges.push({
          label: product.attributes.country,
          icon: <Globe className="h-3 w-3" />,
          variant: 'secondary',
        });
      }
    }

    return badges.slice(0, 4);
  };

  const badges = getAttributeBadges();
  const remainingBadges = product.attributes
    ? Object.keys(product.attributes).length - 4
    : 0;

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            <div className="w-full sm:w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Category */}
              {typeof product.categoryId === 'object' && product.categoryId?.name && (
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  {product.categoryId.name}
                </p>
              )}

              {/* Title */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {product.productName}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Attributes */}
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant === 'success' ? 'default' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {badge.icon}
                    <span className="capitalize">{badge.label}</span>
                  </Badge>
                ))}
                {remainingBadges > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">+{remainingBadges} more</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More attributes available</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-muted-foreground ml-1">
                    ({product.reviewCount || 0})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span>{product.quantity || 0}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col items-end justify-between shrink-0">
              <div className="text-right">
                <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
                {bulkPrice && bulkPrice < product.price && (
                  <div className="text-xs text-muted-foreground">
                    Bulk: ${bulkPrice.toFixed(2)}
                  </div>
                )}
              </div>
              <Button size="sm">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleClick}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground" />
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* Category */}
          {typeof product.categoryId === 'object' && product.categoryId?.name && (
            <p className="text-xs text-muted-foreground uppercase">
              {product.categoryId.name}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
            {product.productName}
          </h3>

          {/* Attributes */}
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant === 'success' ? 'default' : 'secondary'}
                className="flex items-center gap-1 text-xs"
              >
                {badge.icon}
                <span className="capitalize">{badge.label}</span>
              </Badge>
            ))}
            {remainingBadges > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      +{remainingBadges}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More attributes available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Price */}
          <div>
            <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
            {bulkPrice && bulkPrice < product.price && (
              <div className="text-xs text-muted-foreground">
                Bulk pricing from ${bulkPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="text-muted-foreground text-xs ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3 w-3" />
              <span className="text-xs">{product.quantity || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
