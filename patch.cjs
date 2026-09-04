const fs = require('fs');
let content = fs.readFileSync('src/components/admin/EbookUploadControl.tsx', 'utf8');

const regex = /\/\/ Diagnóstico Forense: Validar sessão antes do upload \(Fase 3\.5\)[\s\S]*?onStoragePathUpdated\(targetPath, pageCount\);/m;

const replacement = `// Diagnóstico Forense: Validar sessão antes do upload
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session || !isSupabaseConfigured()) {
        throw new Error('Não há sessão autenticada ou o Supabase não está configurado. O upload foi bloqueado para garantir armazenamento físico definitivo.');
      }
      
      // Fluxo Oficial: Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(EBOOK_UPLOAD_CONFIG.BUCKET_NAME)
        .upload(targetPath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
          contentType: 'application/pdf',
          // @ts-ignore - utilizando o callback onUploadProgress suportado por algumas versões do SDK
          onUploadProgress: (progress: any) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });

      if (uploadError) {
        // Diagnóstico Forense
        const forensicErrorMsg = \`[Supabase Storage Diagnostic] Ocorreu uma falha física de upload no Supabase Storage.\\nStatus/Type: \${uploadError.name}\\nMensagem Técnica Original do Supabase: "\${uploadError.message}"\\nOperação: UPLOAD_INSERT (upsert: true)\\nBucket: \${EBOOK_UPLOAD_CONFIG.BUCKET_NAME}\\nPath: \${targetPath}\\nIsso normalmente ocorre quando o arquivo é grande demais (ex: > limite do bucket) ou, MAIS PROVÁVEL, quando as Políticas de Segurança (RLS) rejeitam a gravação (ex: "new row violates row-level security policy for table objects"). Verifique se seu usuário tem privilégio real de 'admin' na tabela public.perfis no Supabase.\`;
        console.error(forensicErrorMsg);
        throw new Error(\`Erro do Supabase: \${uploadError.message}. Consulte o console para diagnóstico completo.\`);
      }

      // 10. APÓS UPLOAD - Verificar se o objeto existe fisicamente
      const exists = await checkStorageFileExists(EBOOK_UPLOAD_CONFIG.BUCKET_NAME, targetPath);
      if (!exists) {
        throw new Error('Falha grave: Upload foi relatado como concluído, mas o arquivo físico não foi encontrado no bucket.');
      }

      // Sucesso
      setUploadProgress(100);
      const fileName = targetPath.split('/').pop() || 'documento.pdf';
      const pageCount = productId === 'prod-depois-dos-60-real' ? 50 : undefined;

      setUploadSuccessData({
        productTitle,
        fileName,
        bucket: EBOOK_UPLOAD_CONFIG.BUCKET_NAME,
        storagePath: targetPath
      });

      setUploadState('SUCCESS');
      onStoragePathUpdated(targetPath, pageCount);`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/admin/EbookUploadControl.tsx', content);
console.log('Replaced local blob fallback logic');
