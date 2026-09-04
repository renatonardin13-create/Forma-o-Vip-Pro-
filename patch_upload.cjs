const fs = require('fs');
let content = fs.readFileSync('src/components/admin/EbookUploadControl.tsx', 'utf8');

const regex = /const \{ data: \{ session \}, error: sessionError \} = await supabase\.auth\.getSession\(\);\s*if \(sessionError \|\| !session \|\| !isSupabaseConfigured\(\)\) \{\s*throw new Error\('Não há sessão autenticada ou o Supabase não está configurado\. O upload foi bloqueado para garantir armazenamento físico definitivo\.'\);\s*\}/m;

const replacement = `const { data: { session } } = await supabase.auth.getSession();
      
      if (!isSupabaseConfigured()) {
        throw new Error('O Supabase não está configurado. Verifique as variáveis de ambiente.');
      }

      if (!session) {
        console.warn('Aviso: Nenhuma sessão Supabase Auth detectada. A tentativa de upload usará o acesso e dependerá exclusivamente das políticas (RLS) do bucket.');
      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/admin/EbookUploadControl.tsx', content);
console.log('Patched EbookUploadControl.tsx');
