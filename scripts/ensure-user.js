const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(".env.local", "utf8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || "";
    val = val.replace(/^["']|["']$/g, "").trim();
    env[match[1]] = val;
  }
});

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const { data, error } = await supabase.auth.admin.listUsers();
  console.log("List users:", { count: data?.users?.length, error: error?.message });
  let userId;
  if (data?.users?.length > 0) {
    userId = data.users[0].id;
    console.log("Using existing user ID:", userId);
  } else {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: "architect@agentarchitect.dev",
      password: "ArchitectPassword123!",
      email_confirm: true,
      user_metadata: { full_name: "Lead Architect" },
    });
    console.log("Created user:", { id: newUser?.user?.id, error: createErr?.message });
    userId = newUser?.user?.id;
  }

  if (userId) {
    // Ensure profile row exists
    const { error: profErr } = await supabase.from("profiles").upsert(
      {
        id: userId,
        email: "architect@agentarchitect.dev",
        full_name: "Lead Architect",
        avatar_url: "",
      },
      { onConflict: "id" }
    );
    console.log("Profile upserted:", { error: profErr?.message });
  }
}
run();