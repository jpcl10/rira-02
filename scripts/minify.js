/**
 * Script para minificar arquivos HTML e JavaScript
 * Reduz o tamanho dos arquivos removendo espaços, comentários e formatação
 */

const fs = require('fs');
const path = require('path');

// Função para minificar HTML
function minifyHTML(content) {
  return content
    // Remover comentários
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remover quebras de linha e espaços extras
    .replace(/\s+/g, ' ')
    // Remover espaços entre tags
    .replace(/>\s+</g, '><')
    // Remover espaços antes de fechar tags
    .replace(/\s+>/g, '>')
    // Remover espaços após abrir tags
    .replace(/<\s+/g, '<')
    // Remover espaços extras em atributos
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Função para minificar JavaScript
function minifyJS(content) {
  // Esta é uma versão muito simplificada - em um projeto real, usar terser ou uglify-js
  return content
    // Remover comentários de uma linha
    .replace(/\/\/.*$/gm, '')
    // Remover comentários de múltiplas linhas
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remover quebras de linha e espaços extras
    .replace(/\s+/g, ' ')
    // Remover espaços antes/depois de operadores
    .replace(/\s*([=+\-*/<>!?:;,{}()[\]])\s*/g, '$1')
    .trim();
}

// Minificar um arquivo
function minifyFile(inputFile, outputFile, type) {
  try {
    console.log(`Minificando: ${inputFile}`);
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(inputFile, 'utf8');
    
    // Minificar baseado no tipo
    let minified;
    if (type === 'html') {
      minified = minifyHTML(content);
    } else if (type === 'js') {
      minified = minifyJS(content);
    } else {
      throw new Error(`Tipo não suportado: ${type}`);
    }
    
    // Calcular taxa de compressão
    const originalSize = content.length;
    const minifiedSize = minified.length;
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    // Salvar arquivo minificado
    fs.writeFileSync(outputFile, minified);
    
    console.log(`Minificado: ${outputFile}`);
    console.log(`Redução: ${reduction}% (${originalSize} -> ${minifiedSize} bytes)`);
    
    return {
      originalSize,
      minifiedSize,
      reduction
    };
  } catch (error) {
    console.error(`Erro ao minificar ${inputFile}: ${error.message}`);
    throw error;
  }
}

// Função principal
function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  // Criar diretório dist se não existir
  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Criar diretórios para arquivos minificados
  fs.mkdirSync(path.join(distDir, 'frontend', 'tv'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'frontend', 'painel'), { recursive: true });
  
  // Minificar arquivos
  const files = [
    {
      input: path.join(rootDir, 'src', 'frontend', 'tv', 'index.html'),
      output: path.join(distDir, 'frontend', 'tv', 'index.html'),
      type: 'html'
    },
    {
      input: path.join(rootDir, 'src', 'frontend', 'painel', 'index.html'),
      output: path.join(distDir, 'frontend', 'painel', 'index.html'),
      type: 'html'
    }
  ];
  
  // Processar cada arquivo
  let totalOriginal = 0;
  let totalMinified = 0;
  
  console.log("=== MINIFICAÇÃO DE ARQUIVOS ===");
  
  files.forEach(file => {
    try {
      const result = minifyFile(file.input, file.output, file.type);
      totalOriginal += result.originalSize;
      totalMinified += result.minifiedSize;
    } catch (error) {
      console.error(`Falha ao processar ${file.input}: ${error.message}`);
    }
  });
  
  // Copiar arquivos de assets
  const assetsDir = path.join(rootDir, 'src', 'frontend', 'tv', 'assets');
  const distAssetsDir = path.join(distDir, 'frontend', 'tv', 'assets');
  
  if (fs.existsSync(assetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
    fs.cpSync(assetsDir, distAssetsDir, { recursive: true });
    console.log(`Copiado: assets para ${distAssetsDir}`);
  }
  
  // Estatísticas finais
  const totalReduction = ((totalOriginal - totalMinified) / totalOriginal * 100).toFixed(2);
  console.log("\n=== RESUMO DA MINIFICAÇÃO ===");
  console.log(`Total original: ${totalOriginal} bytes`);
  console.log(`Total minificado: ${totalMinified} bytes`);
  console.log(`Redução total: ${totalReduction}%`);
  console.log("===============================");
}

// Executar script
try {
  main();
} catch (error) {
  console.error(`Erro durante a minificação: ${error}`);
  process.exit(1);
} 