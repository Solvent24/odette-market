import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, Upload, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category_id: string | null;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  is_sale: boolean;
}

interface Category {
  id: string;
  name: string;
}

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { formatPrice } = useSiteSettings();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    image_url: "",
    category_id: "",
    stock: "",
    is_featured: false,
    is_new: false,
    is_sale: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      original_price: "",
      image_url: "",
      category_id: "",
      stock: "",
      is_featured: false,
      is_new: false,
      is_sale: false,
    });
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: language === "rw" ? "Ikosa" : "Error",
        description: language === "rw" ? "Hitamo ifoto gusa" : "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: language === "rw" ? "Ikosa" : "Error",
        description: language === "rw" ? "Ifoto ntirenze 5MB" : "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast({
        title: language === "rw" ? "Byagenze neza" : "Success",
        description: language === "rw" ? "Ifoto yashyizweho" : "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: language === "rw" ? "Ikosa" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      stock: product.stock.toString(),
      is_featured: product.is_featured || false,
      is_new: product.is_new || false,
      is_sale: product.is_sale || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      image_url: formData.image_url || null,
      category_id: formData.category_id || null,
      stock: parseInt(formData.stock) || 0,
      is_featured: formData.is_featured,
      is_new: formData.is_new,
      is_sale: formData.is_sale,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast({ title: language === "rw" ? "Igicuruzwa cyahinduwe" : "Product updated successfully" });
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        toast({ title: language === "rw" ? "Igicuruzwa cyongeweho" : "Product created successfully" });
      }

      fetchProducts();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: language === "rw" ? "Ikosa" : "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === "rw" ? "Uremeza gusiba iki gicuruzwa?" : "Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast({ title: language === "rw" ? "Igicuruzwa cyasibwe" : "Product deleted successfully" });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: language === "rw" ? "Ikosa" : "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products Management</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">{language === "rw" ? "Igiciro *" : "Price *"}</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original_price">{language === "rw" ? "Igiciro cy'umwimerere" : "Original Price"}</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">{language === "rw" ? "Iboneka *" : "Stock *"}</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{language === "rw" ? "Icyiciro" : "Category"}</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "rw" ? "Hitamo icyiciro" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <Label>{language === "rw" ? "Ifoto y'igicuruzwa" : "Product Image"}</Label>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image Preview */}
                    <div className="w-full sm:w-32 h-32 bg-secondary rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      {formData.image_url ? (
                        <img
                          src={formData.image_url}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full sm:w-auto"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {language === "rw" ? "Birashyirwa..." : "Uploading..."}
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {language === "rw" ? "Fungura ifoto" : "Upload Image"}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {language === "rw" ? "Cyangwa shyiramo URL y'ifoto" : "Or enter image URL manually"}
                      </p>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_featured: checked })
                      }
                    />
                    <Label htmlFor="is_featured">{language === "rw" ? "Byakunzwe" : "Featured"}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_new"
                      checked={formData.is_new}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_new: checked })
                      }
                    />
                    <Label htmlFor="is_new">{language === "rw" ? "Bishya" : "New"}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_sale"
                      checked={formData.is_sale}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_sale: checked })
                      }
                    />
                    <Label htmlFor="is_sale">{language === "rw" ? "Kuri Sale" : "On Sale"}</Label>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {language === "rw" ? "Hagarika" : "Cancel"}
                  </Button>
                  <Button type="submit">
                    {editingProduct
                      ? language === "rw" ? "Hindura Igicuruzwa" : "Update Product"
                      : language === "rw" ? "Ongeraho Igicuruzwa" : "Create Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    ${product.price.toFixed(2)}
                    {product.original_price && (
                      <span className="text-muted-foreground line-through ml-2">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock < 10
                          ? "text-destructive font-medium"
                          : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.is_featured && (
                        <span className="badge-new text-[10px]">Featured</span>
                      )}
                      {product.is_new && (
                        <span className="badge-new text-[10px]">New</span>
                      )}
                      {product.is_sale && (
                        <span className="badge-sale text-[10px]">Sale</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsManagement;
