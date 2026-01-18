import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X } from 'lucide-react';

interface AttributeSchema {
  [key: string]: {
    type: string;
    options?: string[];
    label?: string;
    required?: boolean;
  };
}

interface FilterPanelProps {
  attributeSchema?: AttributeSchema;
  onFilterChange: (filters: any) => void;
  onClose?: () => void;
  className?: string;
}

const COUNTRIES = [
  { value: 'USA', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'EU', label: 'European Union' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'India', label: 'India' },
  { value: 'Other', label: 'Other' },
];

export default function FilterPanel({
  attributeSchema = {},
  onFilterChange,
  onClose,
  className = '',
}: FilterPanelProps) {
  const [filters, setFilters] = useState<any>({
    quality: [],
    twoFa: undefined,
    emailAccess: undefined,
    recovery: undefined,
    verified: undefined,
    country: '',
    priceRange: [0, 1000],
  });

  const handleQualityChange = (quality: string, checked: boolean) => {
    setFilters((prev: any) => ({
      ...prev,
      quality: checked
        ? [...prev.quality, quality]
        : prev.quality.filter((q: string) => q !== quality),
    }));
  };

  const handleBooleanFilterChange = (key: string, value: boolean | undefined) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCountryChange = (country: string) => {
    setFilters((prev: any) => ({
      ...prev,
      country,
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters((prev: any) => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleApplyFilters = () => {
    const cleanedFilters: any = {};

    // Add quality filters
    if (filters.quality.length > 0) {
      cleanedFilters.quality = filters.quality;
    }

    // Add boolean filters
    if (filters.twoFa !== undefined) {
      cleanedFilters.twoFa = filters.twoFa;
    }
    if (filters.emailAccess !== undefined) {
      cleanedFilters.emailAccess = filters.emailAccess;
    }
    if (filters.recovery !== undefined) {
      cleanedFilters.recovery = filters.recovery;
    }
    if (filters.verified !== undefined) {
      cleanedFilters.verified = filters.verified;
    }

    // Add country filter
    if (filters.country) {
      cleanedFilters.country = filters.country;
    }

    // Add price range
    cleanedFilters.minPrice = filters.priceRange[0];
    cleanedFilters.maxPrice = filters.priceRange[1];

    onFilterChange(cleanedFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      quality: [],
      twoFa: undefined,
      emailAccess: undefined,
      recovery: undefined,
      verified: undefined,
      country: '',
      priceRange: [0, 1000],
    });
    onFilterChange({});
  };

  // Get quality options from schema or use defaults
  const qualityOptions =
    attributeSchema.quality?.options || ['new', 'old', 'fresh', 'aged', 'used'];

  return (
    <div className={`bg-background border rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Sections */}
      <Accordion type="multiple" defaultValue={['quality', 'security', 'access', 'country', 'price']} className="w-full">
        {/* Quality Filter */}
        {attributeSchema.quality && (
          <AccordionItem value="quality">
            <AccordionTrigger>Quality</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {qualityOptions.map((quality) => (
                  <div key={quality} className="flex items-center space-x-2">
                    <Checkbox
                      id={`quality-${quality}`}
                      checked={filters.quality.includes(quality)}
                      onCheckedChange={(checked) =>
                        handleQualityChange(quality, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`quality-${quality}`}
                      className="text-sm font-normal capitalize cursor-pointer"
                    >
                      {quality}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Security Filter */}
        {(attributeSchema.twoFa || attributeSchema.recovery) && (
          <AccordionItem value="security">
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {attributeSchema.twoFa && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">2FA</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.twoFa === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('twoFa', true)}
                      >
                        Enabled
                      </Button>
                      <Button
                        variant={filters.twoFa === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('twoFa', false)}
                      >
                        Disabled
                      </Button>
                      <Button
                        variant={filters.twoFa === undefined ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('twoFa', undefined)}
                      >
                        Any
                      </Button>
                    </div>
                  </div>
                )}

                {attributeSchema.recovery && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Recovery</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.recovery === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('recovery', true)}
                      >
                        Added
                      </Button>
                      <Button
                        variant={filters.recovery === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('recovery', false)}
                      >
                        Not Added
                      </Button>
                      <Button
                        variant={filters.recovery === undefined ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('recovery', undefined)}
                      >
                        Any
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Access Filter */}
        {(attributeSchema.emailAccess || attributeSchema.verified) && (
          <AccordionItem value="access">
            <AccordionTrigger>Access</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {attributeSchema.emailAccess && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Access</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.emailAccess === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('emailAccess', true)}
                      >
                        Included
                      </Button>
                      <Button
                        variant={filters.emailAccess === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('emailAccess', false)}
                      >
                        Not Included
                      </Button>
                      <Button
                        variant={filters.emailAccess === undefined ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('emailAccess', undefined)}
                      >
                        Any
                      </Button>
                    </div>
                  </div>
                )}

                {attributeSchema.verified && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Verified</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.verified === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('verified', true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={filters.verified === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('verified', false)}
                      >
                        No
                      </Button>
                      <Button
                        variant={filters.verified === undefined ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleBooleanFilterChange('verified', undefined)}
                      >
                        Any
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Country Filter */}
        {attributeSchema.country && (
          <AccordionItem value="country">
            <AccordionTrigger>Country</AccordionTrigger>
            <AccordionContent>
              <Select value={filters.country} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={0}
                max={1000}
                step={5}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                className="my-4"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Min: ${filters.priceRange[0]}
                </span>
                <span className="text-muted-foreground">
                  Max: ${filters.priceRange[1]}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={handleResetFilters} variant="outline" className="w-full">
          Reset All
        </Button>
      </div>
    </div>
  );
}
