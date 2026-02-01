import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_new: boolean | null;
  is_sale: boolean | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filters
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showSaleOnly, setShowSaleOnly] = useState(searchParams.get("sale") === "true");
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  
  const searchQuery = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categorySlug, showSaleOnly, showNewOnly, sortBy, selectedCategories, priceRange]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    let query = supabase.from("products").select("*, categories(slug)");

    // Search filter
    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    // Category filter from URL
    if (categorySlug) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    // Selected categories filter
    if (selectedCategories.length > 0) {
      query = query.in("category_id", selectedCategories);
    }

    // Sale filter
    if (showSaleOnly) {
      query = query.eq("is_sale", true);
    }

    // New filter
    if (showNewOnly) {
      query = query.eq("is_new", true);
    }

    // Price filter
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

    // Sorting
    switch (sortBy) {
      case "price-low":
        query = query.order("price", { ascending: true });
        break;
      case "price-high":
        query = query.order("price", { ascending: false });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setShowSaleOnly(false);
    setShowNewOnly(false);
    setSortBy("newest");
    setSearchParams({});
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={500}
          step={10}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sale & New */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Special</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={showSaleOnly}
              onCheckedChange={(checked) => setShowSaleOnly(checked as boolean)}
            />
            <span className="text-sm">On Sale</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={showNewOnly}
              onCheckedChange={(checked) => setShowNewOnly(checked as boolean)}
            />
            <span className="text-sm">New Arrivals</span>
          </label>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="section-heading mb-2">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : categorySlug
                ? categories.find((c) => c.slug === categorySlug)?.name || "Shop"
                : showSaleOnly
                ? "Sale Items"
                : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {products.length} products found
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32 bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h3>
                <FiltersContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-4 ml-auto">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-2xl animate-pulse aspect-[3/4]"
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}