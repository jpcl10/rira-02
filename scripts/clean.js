/**
 * Script de limpeza avançada do projeto RIRA 21
 * Remove arquivos e diretórios desnecessários para reduzir o tamanho
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Diretórios e arquivos a serem removidos
const PATHS_TO_REMOVE = [
  'node_modules',
  'package-lock.json',
  'logs/*',
  '.gitignore',
  'dist',
  '**/.DS_Store',
  '.sanitized-trash',
  'tests/integration/test-*.js'
];

// Diretórios a manter vazios (não remover completamente)
const DIRS_TO_KEEP_EMPTY = [
  'logs'
];

// Função para executar comandos
function execCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executando: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro: ${error.message}`);
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Função para remover um caminho
async function removePath(pathToRemove) {
  try {
    const fullPath = path.resolve(__dirname, '..', pathToRemove);
    
    // Verificar se o caminho existe
    if (!fs.existsSync(fullPath)) {
      console.log(`Aviso: Caminho não encontrado: ${pathToRemove}`);
      return;
    }
    
    // Se for um diretório que deve ser mantido vazio
    if (DIRS_TO_KEEP_EMPTY.includes(pathToRemove)) {
      await execCommand(`rm -rf ${fullPath}/*`);
      console.log(`Diretório esvaziado: ${pathToRemove}`);
    } else {
      // Se for um padrão com **
      if (pathToRemove.includes('**')) {
        const pattern = pathToRemove.replace('**/', '');
        await execCommand(`find . -name "${pattern}" -type f -delete`);
        console.log(`Arquivos removidos: ${pattern}`);
      } else {
        // Caso contrário, remover normalmente
        await execCommand(`rm -rf ${fullPath}`);
        console.log(`Removido: ${pathToRemove}`);
      }
    }
  } catch (error) {
    console.error(`Erro ao remover ${pathToRemove}: ${error.message}`);
  }
}

// Função principal
async function main() {
  console.log("=== LIMPEZA AVANÇADA DO PROJETO RIRA 21 ===");
  
  // Verificar tamanho inicial
  const initialSize = await execCommand('du -sh .');
  console.log(`Tamanho inicial: ${initialSize}`);
  
  // Remover cada caminho
  for (const pathToRemove of PATHS_TO_REMOVE) {
    await removePath(pathToRemove);
  }
  
  // Criar diretórios vazios necessários
  for (const dir of DIRS_TO_KEEP_EMPTY) {
    const fullPath = path.resolve(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Diretório criado: ${dir}`);
    }
  }
  
  // Verificar tamanho final
  const finalSize = await execCommand('du -sh .');
  console.log(`Tamanho final: ${finalSize}`);
  
  console.log("=== LIMPEZA CONCLUÍDA ===");
}

// Executar o script
main().catch(error => {
  console.error(`Erro durante a limpeza: ${error}`);
  process.exit(1);
}); 