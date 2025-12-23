import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generic error messages for client - never expose internal details
const CLIENT_ERRORS = {
  CONFIG_ERROR: "Service configuration error",
  FETCH_SHOPS_ERROR: "Unable to load store information",
  FETCH_PRODUCTS_ERROR: "Unable to load products",
  INTERNAL_ERROR: "An unexpected error occurred",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PRINTIFY_API_TOKEN = Deno.env.get("PRINTIFY_API_TOKEN");
    
    if (!PRINTIFY_API_TOKEN) {
      console.error("PRINTIFY_API_TOKEN not found in environment");
      return new Response(
        JSON.stringify({ error: CLIENT_ERRORS.CONFIG_ERROR }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching shops from Printify...");

    // First, get the shop ID
    const shopsResponse = await fetch("https://api.printify.com/v1/shops.json", {
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!shopsResponse.ok) {
      const errorText = await shopsResponse.text();
      console.error("Failed to fetch shops - Status:", shopsResponse.status, "Details:", errorText);
      return new Response(
        JSON.stringify({ error: CLIENT_ERRORS.FETCH_SHOPS_ERROR }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shops = await shopsResponse.json();
    console.log("Shops fetched:", shops.length);

    if (!shops || shops.length === 0) {
      console.log("No shops found, returning empty products");
      return new Response(
        JSON.stringify({ products: [], shopId: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shopId = shops[0].id;
    console.log("Using shop ID:", shopId);

    // Fetch products from the shop
    const productsResponse = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      console.error("Failed to fetch products - Status:", productsResponse.status, "Details:", errorText);
      return new Response(
        JSON.stringify({ error: CLIENT_ERRORS.FETCH_PRODUCTS_ERROR }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productsData = await productsResponse.json();
    console.log("Products fetched:", productsData.data?.length || 0);

    // Transform products to a cleaner format
    const products = (productsData.data || []).map((product: any) => {
      // Get unique sizes from variants - extract only actual sizes (S, M, L, XL, etc.)
      // Printify format is typically "Color / Size" - we only want actual clothing sizes
      const sizePatterns = /^(XXS|XS|S|M|L|XL|2XL|3XL|4XL|5XL|ONE SIZE|\d+)$/i;
      const extractedSizes: string[] = [];
      
      product.variants?.forEach((v: any) => {
        const parts = v.title?.split(" / ") || [];
        parts.forEach((part: string) => {
          const trimmed = part.trim();
          if (sizePatterns.test(trimmed) && !extractedSizes.includes(trimmed)) {
            extractedSizes.push(trimmed);
          }
        });
      });
      
      // Sort sizes in logical order
      const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
      const sizes = extractedSizes.sort((a, b) => {
        const aIndex = sizeOrder.indexOf(a.toUpperCase());
        const bIndex = sizeOrder.indexOf(b.toUpperCase());
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      });
      
      // Get price from first enabled variant
      const enabledVariant = product.variants?.find((v: any) => v.is_enabled);
      const priceInCents = enabledVariant?.price || 0;
      const priceUSD = priceInCents / 100;
      
      // Get primary image
      const primaryImage = product.images?.find((img: any) => img.is_default)?.src || 
                          product.images?.[0]?.src || 
                          "/placeholder.svg";

      // Get all images
      const images = product.images?.map((img: any) => img.src) || ["/placeholder.svg"];

      return {
        id: product.id,
        title: product.title,
        description: product.description || "",
        priceUSD,
        images,
        primaryImage,
        sizes,
        colors: [],
        variants: product.variants?.filter((v: any) => v.is_enabled).map((v: any) => ({
          id: v.id,
          title: v.title,
          price: v.price / 100,
          sku: v.sku,
          isAvailable: v.is_available,
        })) || [],
        tags: product.tags || [],
        visible: product.visible,
        createdAt: product.created_at,
      };
    });

    console.log("Returning", products.length, "products");

    return new Response(
      JSON.stringify({ products, shopId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in printify-products function:", error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ error: CLIENT_ERRORS.INTERNAL_ERROR }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
