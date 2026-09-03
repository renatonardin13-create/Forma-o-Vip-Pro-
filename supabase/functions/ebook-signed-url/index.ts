
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Get JWT from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Initialize Supabase Client with User's JWT (to verify session)
    // We use service role to check permissions and generate signed URL, 
    // but we first verify the user identity.
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized", detail: authError?.message }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // 3. Get productId from request body
    const { productId } = await req.json();
    if (!productId) {
      return new Response(JSON.stringify({ error: "Missing productId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Fetch Digital Product and its Area
    const { data: product, error: prodError } = await supabaseClient
      .from("digital_products")
      .select("id, area_id, storage_path, type")
      .eq("id", productId)
      .single();

    if (prodError || !product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (product.type !== 'ebook' || !product.storage_path) {
      return new Response(JSON.stringify({ error: "Product has no protected file configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Check Authorization (Admin, Individual Access, or Full Area Access)
    
    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from("perfis")
      .select("role")
      .eq("id", userId)
      .single();
    
    const isAdmin = profile?.role === 'admin';

    let hasAccess = isAdmin;

    if (!hasAccess) {
      // Check for access in user_area_accesses
      const { data: accesses, error: accessError } = await supabaseClient
        .from("user_area_accesses")
        .select("id, status, expiration_date")
        .eq("user_id", userId)
        .eq("area_id", product.area_id)
        .eq("status", "active")
        .or(`product_id.is.null,product_id.eq.${productId}`);

      if (!accessError && accesses && accesses.length > 0) {
        // Check if any active access is not expired
        const now = new Date();
        hasAccess = accesses.some(acc => {
          if (!acc.expiration_date) return true;
          return new Date(acc.expiration_date) > now;
        });
      }
    }

    if (!hasAccess) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Generate Signed URL
    // storage_path should be something like "ebooks/prod-123/file.pdf" 
    // or just the filename if we assume "ebooks/" bucket.
    // Based on migration, bucket is "ebooks".
    // Let's assume storage_path is the full path within the bucket or just the filename.
    // The instructions say: ebooks/{product_id}/arquivo.pdf
    
    const { data: signedUrlData, error: signedError } = await supabaseClient
      .storage
      .from("ebooks")
      .createSignedUrl(product.storage_path, 60 * 15); // 15 minutes

    if (signedError || !signedUrlData) {
      console.error("[Storage Error]", signedError);
      return new Response(JSON.stringify({ error: "Failed to generate signed URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ signedUrl: signedUrlData.signedUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Internal Server Error", detail: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
