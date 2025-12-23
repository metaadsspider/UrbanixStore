import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  images: string[];
  primaryImage: string;
  sizes: string[];
  colors: string[];
  variants: {
    id: number;
    title: string;
    price: number;
    sku: string;
    isAvailable: boolean;
  }[];
  tags: string[];
  visible: boolean;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  shopId: string | null;
}

async function fetchProducts(): Promise<ProductsResponse> {
  const { data, error } = await supabase.functions.invoke("printify-products");
  
  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }
  
  return data as ProductsResponse;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useProduct(productId: string) {
  const { data, ...rest } = useProducts();
  
  const product = data?.products.find((p) => p.id === productId);
  
  return {
    data: product,
    ...rest,
  };
}

// Categorize products based on tags or title
export function categorizeProduct(product: Product): string {
  const title = product.title.toLowerCase();
  const tags = product.tags.map((t) => t.toLowerCase());
  
  // Check for caps first
  if (tags.includes("cap") || tags.includes("hat") || title.includes("cap") || title.includes("hat")) {
    return "caps";
  }
  
  // Check for clothes
  if (tags.includes("shirt") || tags.includes("tshirt") || tags.includes("t-shirt") || 
      tags.includes("hoodie") || tags.includes("jacket") || tags.includes("sweater") ||
      title.includes("shirt") || title.includes("hoodie") || title.includes("jacket")) {
    return "clothes";
  }
  
  // Everything else goes to "others" (mugs, accessories, bags, etc.)
  return "others";
}
