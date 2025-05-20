/**
 * Script para executar testes unitários
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Verificar se o Mocha está instalado
const checkMocha = () => {
  try {
    execSync('npx mocha --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Instalar Mocha se necessário
const installMocha = () => {
  console.log('Instalando Mocha...');
  try {
    execSync('npm install --save-dev mocha', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Erro ao instalar Mocha:', error.message);
    return false;
  }
};

// Executar testes
const runTests = () => {
  console.log('\n🧪 Executando testes unitários...');
  try {
    execSync('npx mocha tests/unit/**/*.test.js', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('\n❌ Falha nos testes!');
    return false;
  }
};

// Função principal
const main = () => {
  console.log('\n======================================');
  console.log('🚀 Sistema RIRA 21 - Execução de Testes');
  console.log('======================================\n');

  // Verificar se o diretório de testes existe
  const testDir = path.join(__dirname, '..', 'tests', 'unit');
  if (!fs.existsSync(testDir)) {
    console.error(`❌ Diretório de testes não encontrado: ${testDir}`);
    return 1;
  }

  // Verificar se há testes para executar
  const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.test.js'));
  if (testFiles.length === 0) {
    console.error('❌ Nenhum arquivo de teste encontrado!');
    return 1;
  }

  console.log(`📁 Encontrados ${testFiles.length} arquivos de teste.`);

  // Verificar e instalar Mocha se necessário
  if (!checkMocha() && !installMocha()) {
    console.error('❌ Não foi possível instalar o Mocha. Abortando.');
    return 1;
  }

  // Executar testes
  const success = runTests();

  if (success) {
    console.log('\n✅ Todos os testes passaram com sucesso!');
    return 0;
  } else {
    return 1;
  }
};

// Executar o script
process.exit(main());