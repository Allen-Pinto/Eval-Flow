import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

async function seed() {
  console.log('🌱 Starting seed process...\n');

  try {
    // Step 1: Create test user
    console.log('1️⃣  Creating test user...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log(`✓ Test user already exists: ${TEST_EMAIL}`);
      } else {
        throw authError;
      }
    } else {
      console.log(`✓ Created test user: ${TEST_EMAIL}`);
    }

    // Get the user ID
    const { data: users } = await supabase.auth.admin.listUsers();
    const testUser = users?.users.find((u) => u.email === TEST_EMAIL);
    if (!testUser) throw new Error('Failed to find test user');

    const userId = testUser.id;

    // Step 2: Create profile
    console.log('\n2️⃣  Creating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: TEST_EMAIL,
        full_name: 'Test User',
        organization: 'Test Organization',
      });

    if (profileError && !profileError.message.includes('duplicate')) {
      throw profileError;
    }
    console.log('✓ Profile created');

    // Step 3: Create evaluation config
    console.log('\n3️⃣  Creating evaluation config...');
    const { error: configError } = await supabase.from('evaluation_configs').upsert({
      user_id: userId,
      run_policy: 'always',
      sample_rate_pct: 100,
      obfuscate_pii: true,
      max_eval_per_day: 5000,
    });

    if (configError) throw configError;
    console.log('✓ Config created');

    // Step 4: Generate sample evaluations
    console.log('\n4️⃣  Generating 5000 sample evaluations...');

    const prompts = [
      'Summarize the following article',
      'Translate this text to Spanish',
      'Generate a Python function for',
      'Explain the concept of',
      'What are the pros and cons of',
      'How would you solve',
      'Create a detailed plan for',
      'Analyze the sentiment of',
    ];

    const responses = [
      'The article discusses key points about innovation and technology trends.',
      'This is a translation of the requested content.',
      'Here is a Python function that accomplishes the task efficiently.',
      'This concept refers to a fundamental principle in...',
      'There are several advantages and disadvantages to consider.',
      'Here is my approach to solving this problem.',
      'Here is a detailed plan with steps and timelines.',
      'The sentiment appears to be positive overall.',
    ];

    const flags = ['hallucination_detected', 'pii_found', 'toxic_content', 'factually_incorrect', null];

    let evaluations = [];

    for (let i = 0; i < 5000; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      evaluations.push({
        user_id: userId,
        interaction_id: `conv_${Math.random().toString(36).substr(2, 9)}`,
        prompt: prompts[Math.floor(Math.random() * prompts.length)],
        response: responses[Math.floor(Math.random() * responses.length)],
        score: Math.round(Math.random() * 100 * 10) / 10,
        latency_ms: Math.floor(100 + Math.random() * 2000),
        flags: flags[Math.floor(Math.random() * flags.length)]
          ? [flags[Math.floor(Math.random() * flags.length)]]
          : [],
        pii_tokens_redacted: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        created_at: date.toISOString(),
      });
    }

    // Insert in batches of 500
    for (let i = 0; i < evaluations.length; i += 500) {
      const batch = evaluations.slice(i, i + 500);
      const { error } = await supabase.from('evaluations').insert(batch);
      if (error) throw error;
      console.log(`  ✓ Inserted ${Math.min(i + 500, evaluations.length)} / 5000`);
    }

    console.log('\n✅ Seed complete!\n');
    console.log('Test credentials:');
    console.log(`  Email: ${TEST_EMAIL}`);
    console.log(`  Password: ${TEST_PASSWORD}\n`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();