
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
  old_record?: any;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const payload: WebhookPayload = await req.json();
    
    // Solo procesamos eventos de inserciones en auth.users
    if (payload.type === "INSERT" && payload.table === "users" && payload.schema === "auth") {
      const user = payload.record;
      
      // Extraer los metadatos del usuario
      const metadata = user.raw_user_meta_data || {};
      
      // Crear un nuevo perfil para el usuario
      await supabaseClient.from("profiles").insert({
        id: user.id,
        full_name: metadata.full_name || "Usuario",
        role: metadata.role || "individual",
        dni: metadata.dni || "",
        phone: metadata.phone || "",
      });
      
      console.log(`Profile created for user ${user.id}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
