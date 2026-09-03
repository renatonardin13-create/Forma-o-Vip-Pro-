
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductUpsert() {
  console.log('--- Testing Product Upsert ---');
  const userId = '00000000-0000-0000-0000-000000000000'; // Fake UUID for test
  const productId = 'test-prod-1';
  const areaId = 'test-area-1';

  // Attempt 1: Insert
  console.log('Attempt 1: Insert...');
  const { data: d1, error: e1 } = await supabase.from('user_area_accesses').upsert(
    {
      id: `test_prod_${Date.now()}`,
      user_id: userId,
      area_id: areaId,
      product_id: productId,
      status: 'active'
    },
    { onConflict: 'user_id, product_id' }
  );

  if (e1) {
    console.error('Error 1:', e1.message);
  } else {
    console.log('Success 1');
  }

  // Attempt 2: Duplicate Upsert
  console.log('Attempt 2: Duplicate Upsert...');
  const { data: d2, error: e2 } = await supabase.from('user_area_accesses').upsert(
    {
      id: `test_prod_${Date.now() + 1}`,
      user_id: userId,
      area_id: areaId,
      product_id: productId,
      status: 'active'
    },
    { onConflict: 'user_id, product_id' }
  );

  if (e2) {
    console.error('Error 2:', e2.message);
  } else {
    console.log('Success 2');
  }
}

async function testAreaUpsert() {
  console.log('\n--- Testing Area Upsert ---');
  const userId = '00000000-0000-0000-0000-000000000000';
  const areaId = 'test-area-1';

  // Attempt 1: Insert
  console.log('Attempt 1: Insert...');
  const { data: d1, error: e1 } = await supabase.from('user_area_accesses').upsert(
    {
      id: `test_area_${Date.now()}`,
      user_id: userId,
      area_id: areaId,
      product_id: null,
      status: 'active'
    },
    { onConflict: 'user_id, area_id' }
  );

  if (e1) {
    console.error('Error 1:', e1.message);
  } else {
    console.log('Success 1');
  }

  // Attempt 2: Duplicate Upsert
  console.log('Attempt 2: Duplicate Upsert...');
  const { data: d2, error: e2 } = await supabase.from('user_area_accesses').upsert(
    {
      id: `test_area_${Date.now() + 1}`,
      user_id: userId,
      area_id: areaId,
      product_id: null,
      status: 'active'
    },
    { onConflict: 'user_id, area_id' }
  );

  if (e2) {
    console.error('Error 2:', e2.message);
  } else {
    console.log('Success 2');
  }
}

async function runTests() {
  try {
    await testProductUpsert();
    await testAreaUpsert();
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runTests();
