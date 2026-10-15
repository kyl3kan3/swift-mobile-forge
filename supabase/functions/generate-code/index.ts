
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }
    const authorization = req.headers.get('Authorization') ?? '';
    if (!authorization.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Sign in required' }), { status: 401, headers: corsHeaders });
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser(authorization.slice(7));
    if (authError || !user || user.is_anonymous) {
      return new Response(JSON.stringify({ error: 'Sign in required' }), { status: 401, headers: corsHeaders });
    }
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }

    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > 65536) {
      return new Response(JSON.stringify({ error: 'Request too large' }), { status: 413, headers: corsHeaders });
    }
    const { prompt = '', project, platform } = JSON.parse(raw);

    if (typeof prompt !== 'string' || prompt.length > 4000 || !project || typeof project.id !== 'string' ||
        !['react', 'swift', 'kotlin', 'flutter'].includes(platform) || !Array.isArray(project.screens) || project.screens.length > 30) {
      throw new Error("Missing required parameters");
    }
    const { data: ownedProject, error: projectError } = await supabase.from('projects')
      .select('id').eq('id', project.id).eq('user_id', user.id).maybeSingle();
    if (projectError || !ownedProject) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 403, headers: corsHeaders });
    }
    // The database reserves quota atomically across every edge-function instance.
    const { data: allowed, error: quotaError } = await supabase.rpc('consume_codegen_quota');
    if (quotaError) {
      return new Response(JSON.stringify({ error: 'Generation quota unavailable' }), { status: 503, headers: corsHeaders });
    }
    if (allowed !== true) {
      return new Response(JSON.stringify({ error: 'Daily generation limit reached' }), { status: 429, headers: corsHeaders });
    }

    // Convert project data to a formatted string
    const projectDescription = `
App Name: ${project.name}
App Description: ${project.description}

Screens:
${project.screens.map(screen => `
Screen: ${screen.name}
Components: 
${screen.components.map(comp => `- Type: ${comp.type}, Properties: ${JSON.stringify(comp.props)}`).join('\n')}
`).join('\n')}
`;

    // Build system message based on platform
    const platformInstructions = {
      react: "Generate React Native code with proper navigation, styling, and component structure.",
      swift: "Generate Swift/SwiftUI code following iOS design guidelines and conventions.",
      kotlin: "Generate Kotlin code with Jetpack Compose for Android app development.",
      flutter: "Generate Flutter/Dart code with proper widget structure and navigation."
    };

    // Prepare the OpenAI API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: `You are an expert ${platform === 'react' ? 'React Native' : 
                               platform === 'swift' ? 'Swift/SwiftUI' : 
                               platform === 'kotlin' ? 'Kotlin/Jetpack Compose' : 
                               'Flutter/Dart'} developer. ${platformInstructions[platform as keyof typeof platformInstructions]}
            Produce clean, readable, production-ready code that implements the app described.
            Include comments explaining complex sections.
            Return ONLY code without explanations outside of code comments.`
          },
          {
            role: "user",
            content: `Generate ${platform === 'react' ? 'React Native' : 
                              platform === 'swift' ? 'Swift/SwiftUI' : 
                              platform === 'kotlin' ? 'Kotlin/Jetpack Compose' : 
                              'Flutter/Dart'} code for the following app:
                              
            ${projectDescription}
            
            Additional requirements:
            ${prompt || "Follow best practices for modern app development."}
            
            The generated code should be complete enough to demonstrate all screens and components.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || "OpenAI API error");
    }
    
    const generatedCode = result.choices[0].message.content;

    // Generate an explanation
    const explainResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: "You provide concise explanations about code. Keep explanations under 100 words."
          },
          {
            role: "user",
            content: `Explain what this ${platform} code does in simple terms: ${generatedCode.slice(0, 500)}...`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const explainResult = await explainResponse.json();
    const explanation = explainResult.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        generatedCode, 
        explanation
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error in generate-code function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to generate code. Please try again." 
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
