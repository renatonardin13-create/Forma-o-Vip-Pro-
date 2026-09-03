
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente (Vercel/AI Studio injeta no process.env)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAndActivate() {
  const productId = 'prod-depois-dos-60-real';
  const localFilePath = '/app/applet/depois-dos-60.pdf';
  const storagePath = `${productId}/depois-dos-60-50-cuidados.pdf`;
  const bucketName = 'ebooks';

  console.log(`Lendo arquivo local: ${localFilePath}`);
  if (!fs.existsSync(localFilePath)) {
    console.error('Arquivo PDF local não encontrado!');
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(localFilePath);

  console.log(`Fazendo upload para ${bucketName}/${storagePath}...`);
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) {
    console.error('Erro no upload:', uploadError.message);
    process.exit(1);
  }

  console.log('Upload concluído com sucesso.');

  console.log(`Atualizando produto ${productId} com storage_path...`);
  const { data: updateData, error: updateError } = await supabase
    .from('digital_products')
    .update({ 
      storage_path: storagePath,
      // Atualizando campos que estavam PENDENTE
      full_description: 'Guia prático com 50 cuidados essenciais para melhorar a segurança, a prevenção, a autonomia e a qualidade de vida na terceira idade. Este material consolida orientações sobre segurança doméstica, prevenção de quedas, medicação e bem-estar físico e mental.',
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .select();

  if (updateError) {
    console.error('Erro ao atualizar banco:', updateError.message);
    process.exit(1);
  }

  console.log('Banco de dados atualizado com sucesso.');
  console.log('Produto ativado e pronto para leitura protegida.');
}

uploadAndActivate();
