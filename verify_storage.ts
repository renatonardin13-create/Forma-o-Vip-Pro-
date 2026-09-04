import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env (se existir localmente)
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas.');
  console.log('Certifique-se de que o arquivo .env existe e possui as credenciais do Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyStorage() {
  const bucketName = 'ebooks';
  const folderPath = 'prod-depois-dos-60-real';
  const expectedFile = 'depois-dos-60-50-cuidados.pdf';
  const fullExpectedPath = `${folderPath}/${expectedFile}`;

  console.log(`🔍 Iniciando verificação física no Supabase Storage...`);
  console.log(`📦 Bucket alvo: "${bucketName}"`);
  console.log(`📂 Diretório alvo: "${folderPath}"`);
  console.log(`📄 Arquivo esperado: "${expectedFile}"\n`);

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('❌ Erro ao acessar o bucket do Supabase:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log(`⚠️ O diretório "${folderPath}" está vazio ou não existe no bucket "${bucketName}".`);
      console.log('\n❌ RESULTADO: FALHA - O arquivo físico não foi encontrado.');
      return;
    }

    console.log(`📋 Arquivos encontrados no diretório "${folderPath}":`);
    let fileFound = false;

    data.forEach((file) => {
      // Ignorar o placeholder oculto do Supabase (.emptyFolderPlaceholder)
      if (file.name === '.emptyFolderPlaceholder') return;

      const fileSizeMB = (file.metadata?.size / (1024 * 1024)).toFixed(2);
      const isExpected = file.name === expectedFile;
      
      if (isExpected) fileFound = true;

      console.log(`   ${isExpected ? '👉' : '-'} ${file.name} (Tamanho: ${fileSizeMB} MB)`);
    });

    console.log('\n==================================================');
    if (fileFound) {
      console.log(`✅ SUCESSO: O objeto '${fullExpectedPath}' EXISTE fisicamente no bucket.`);
      console.log('✅ STATUS: UPLOAD VALIDADO COM SUCESSO');
    } else {
      console.log(`❌ ERRO: O objeto exato '${expectedFile}' NÃO FOI ENCONTRADO dentro do diretório.`);
      console.log('❌ STATUS: ARQUIVO AUSENTE');
    }
    console.log('==================================================\n');

  } catch (err: any) {
    console.error('❌ Erro inesperado ao tentar listar os arquivos:', err.message);
  }
}

verifyStorage();
