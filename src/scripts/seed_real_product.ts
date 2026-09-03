
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Tentar carregar env vars
const envFile = fs.readFileSync('.env.example', 'utf-8');
const envLines = envFile.split('\n');
const env: any = {};
envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key) env[key.trim()] = value?.trim() || '';
});

// Nota: Em ambiente real, as chaves estariam no process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedFirstRealProduct() {
  console.log('Iniciando cadastro do primeiro produto real: Depois dos 60...');

  const productId = 'prod-depois-dos-60-real';
  const areaId = 'area-ebooks'; // Área de E-books identificada na auditoria

  const productData = {
    id: productId,
    area_id: areaId,
    title: 'Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer',
    short_description: 'Guia prático com 50 cuidados essenciais para melhorar a segurança, a prevenção, a autonomia e a qualidade de vida na terceira idade.',
    full_description: 'PENDENTE',
    type: 'ebook',
    category: 'Saúde & Bem-estar', // PENDENTE -> Sugerido pelo contexto
    status: 'published',
    order_index: 100, // Ordem alta para aparecer no final/início conforme catálogo
    ebook: {
      pages: 50,
      format: 'PDF',
      pdfUrl: '' // PENDENTE
    },
    storage_path: 'PENDENTE', // ARQUIVO REAL JÁ FORNECIDO (mas não localizado no sistema de arquivos ainda)
    cover_url: 'https://api.iconify.design/lucide:book-open.svg?color=%23D4AF37', // Placeholder temporário
    banner_url: '', // PENDENTE
    access_level: 'vip',
    author: {
      name: 'PENDENTE',
      role: 'Especialista'
    }
  };

  const { data, error } = await supabase
    .from('digital_products')
    .upsert(productData)
    .select();

  if (error) {
    console.error('Erro ao cadastrar produto:', error);
  } else {
    console.log('Produto cadastrado com sucesso:', data[0].id);
    
    // O mapeamento produto_id externo só será feito se o ID for fornecido.
    // Como está PENDENTE, não criamos o mapeamento em produtos_cursos nesta fase
    // para evitar inconsistências.
  }
}

seedFirstRealProduct();
