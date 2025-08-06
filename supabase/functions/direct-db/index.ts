import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, params } = await req.json()
    
    // Create PostgreSQL client with direct connection
    const client = new Client({
      user: "postgres",
      database: "postgres",
      hostname: "db.atxejcaplvqgmggmwdsq.supabase.co",
      port: 5432,
      password: "DGV6QDk0SJx2e9Qi",
    })

    await client.connect()
    
    // Execute the query
    const result = await client.queryObject(query, params || [])
    
    await client.end()

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result.rows,
        rowCount: result.rowCount 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Database error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})