const supabaseConfig = {
    url: "https://fxuqemyiuktzuufbnrzo.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dXFlbXlpdWt0enV1ZmJucnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDQ5MDYsImV4cCI6MjA3OTAyMDkwNn0.w0ajdp9ZVXazn1Lw3b3Pwmsz6rcvvp9NK4yW_YXBKJE"
};

let supabaseClient = null;
let supabaseInitialized = false;

if (supabaseConfig.url && supabaseConfig.anonKey && 
    supabaseConfig.url !== "DEINE_PROJECT_URL" && 
    supabaseConfig.anonKey !== "DEINE_ANON_KEY") {
    import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
        .then(supabaseModule => {
            const { createClient } = supabaseModule;
            supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
            supabaseInitialized = true;
            window.supabase = supabaseClient;
            window.supabaseInitialized = true;
            console.log('✅ Supabase initialized');
        })
        .catch(error => {
            console.error('❌ Error loading Supabase:', error);
            window.supabaseInitialized = false;
        });
} else {
    console.error('❌ Supabase not configured!');
    window.supabaseInitialized = false;
}

window.supabaseReady = new Promise((resolve) => {
    const checkSupabase = setInterval(() => {
        if (window.supabaseInitialized === true) {
            clearInterval(checkSupabase);
            resolve(true);
        } else if (window.supabaseInitialized === false) {
            clearInterval(checkSupabase);
            resolve(false);
        }
    }, 100);
});
