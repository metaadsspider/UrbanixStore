import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PRINTIFY_API_TOKEN = Deno.env.get("PRINTIFY_API_TOKEN");
    
    if (!PRINTIFY_API_TOKEN) {
      console.error("PRINTIFY_API_TOKEN not found");
      return new Response(
        JSON.stringify({ error: "API token not configured" }),
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
      console.error("Failed to fetch shops:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch shops", details: errorText }),
        { status: shopsResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      console.error("Failed to fetch products:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products", details: errorText }),
        { status: productsResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productsData = await productsResponse.json();
    console.log("Products fetched:", productsData.data?.length || 0);

    // Transform products to a cleaner format
    const products = (productsData.data || []).map((product: any) => {
      // Get unique sizes and colors from variants
      const sizes = [...new Set(product.variants?.map((v: any) => v.title?.split(" / ")[1]).filter(Boolean) || [])];
      const colors = [...new Set(product.variants?.map((v: any) => v.title?.split(" / ")[0]).filter(Boolean) || [])];
      
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
        colors,
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in printify-products function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
