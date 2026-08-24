# 🔧 GUIA DE IMPLEMENTAÇÃO - Como Encaixar Seus Códigos

## 📋 O Que Você Tem

Você mencionou que **já possui os códigos** para:
- ✅ Extração de dados do SIGRH
- ✅ Leitura de ofícios do PGENet
- ✅ Geração de PDFs
- ✅ Comunicação entre sistemas

## 🎯 Onde Encaixar Cada Código

### 1️⃣ **CODES DO SIGRH** → `backend/src/integrations/sigrh-connector.js`

**Se você tem:** Funções/classes que fazem login e extraem dados do SIGRH

**Encaixe aqui:**
```javascript
// Seu código aqui
class SeuSIGRHConnector {
  async login(user, pass) {
    // Seu código de autenticação
  }
  
  async extrairDados(cpf) {
    // Seu código de extração
  }
}

// Substitua no final do arquivo:
// export default SeuSIGRHConnector;
```

**Métodos que PRECISA implementar:**
- `login(username, password)` - Retorna `{ success: true/false }`
- `navegarMenus()` - Retorna lista de menus disponíveis
- `abrirProcesso(numeroProcesso)` - Retorna dados do processo
- `extrairFichaFuncional(cpf)` - Retorna ficha com dados pessoais/funcionais
- `extrairCalculos(cpf, mes, ano)` - Retorna vencimentos e descontos
- `extrairHistorico(cpf)` - Retorna histórico de eventos
- `extrairProcessoCompleto(cpf, numeroProcesso)` - Consolida tudo

---

### 2️⃣ **CODE DO INTÉRPRETE DE OFÍCIOS** → `backend/src/integrations/oficio-interpreter.js`

**Se você tem:** Código que analisa textos de ofícios

**Encaixe aqui:**
```javascript
class SeuOficioInterpreter {
  identificarTipo(conteudo) {
    // Seu código de análise
    return { tipo: 'cumprimento', confianca: 0.95 }
  }
  
  extrairCamposNecessarios(conteudo) {
    // Seu código de extração
    return { dados_pessoais: ['cpf', 'nome'], calculos: ['salario'] }
  }
}
```

**O que deve fazer:**
1. Identificar se é **CUMPRIMENTO** (resposta simples) ou **INSTRUÇÃO** (análise jurídica)
2. Extrair CPF, nome, processo do ofício
3. Listar quais dados são necessários buscar no SIGRH

---

### 3️⃣ **CODE DO GERADOR DE PDF** → `backend/src/integrations/response-generator.js`

**Se você tem:** Código que gera PDFs com dados formatados

**Encaixe aqui:**
```javascript
class SeuPDFGenerator {
  async gerarPDF(conteudo, nomeArquivo) {
    // Seu código de geração
    return { sucesso: true, caminho: './pdfs/arquivo.pdf' }
  }
  
  gerarRespostaCumprimento(dados) {
    // Seu template para resposta simples
    return "Texto da resposta..."
  }
  
  gerarParecerJuridico(dados) {
    // Seu template para parecer jurídico
    return "Texto do parecer..."
  }
}
```

---

### 4️⃣ **CÓDIGO DE AUTENTICAÇÃO PGENet** 

**Se você tem:** Login para o PGENet

**Crie novo arquivo:** `backend/src/integrations/pgenet-connector.js`

```javascript
class PGENetConnector {
  constructor(config) {
    this.baseURL = config.PGENET_URL;
    this.username = config.PGENET_USERNAME;
    this.password = config.PGENET_PASSWORD;
  }

  async login(username, password) {
    // Seu código de autenticação PGENet
  }
  
  async buscarOficios() {
    // Buscar ofícios pendentes
  }
  
  async enviarResposta(oficio_id, pdf_path) {
    // Enviar resposta/parecer
  }
}

export default PGENetConnector;
```

---

## 🔄 FLUXO COMPLETO DE IMPLEMENTAÇÃO

### Etapa 1: Preparar Seus Códigos
```bash
# Organize seus arquivos na estrutura:
backend/src/integrations/
├── sigrh-connector.js          ← Seu código SIGRH aqui
├── oficio-interpreter.js       ← Seu código de análise aqui  
├── response-generator.js       ← Seu código de PDF aqui
└── pgenet-connector.js         ← Novo: seu código PGENet aqui
```

### Etapa 2: Encaixar nas Rotas

Em `backend/src/routes/api.js`, as rotas já estão prontas para usar suas classes:

```javascript
// Já existem:
POST /api/auth/login              → Autentica SIGRH + PGENet
GET  /api/sigrh/menus             → Lista menus
GET  /api/sigrh/ficha/:cpf        → Extrai ficha
GET  /api/sigrh/calculos/:cpf     → Extrai cálculos
POST /api/oficio/interpretar      → Interpreta ofício
POST /api/resposta/gerar          → Gera resposta/parecer
POST /api/workflow/completo       → FLUXO COMPLETO
```

### Etapa 3: Testar Workflow Completo

```bash
# 1. Inicie o backend
cd backend
npm install
npm run dev

# 2. Inicie o frontend
cd frontend
npm install
npm run dev

# 3. Acesse http://localhost:5173
# 4. Faça login com credenciais SIGRH
# 5. Veja ofícios pendentes no dashboard
# 6. Clique em "Processar" para ativar o workflow
```

---

## 📊 EXEMPLO PRÁTICO: Usar Seu Código

### Seu Código SIGRH (exemplo)
```javascript
// ANTES: seu código original
class MeuSIGRH {
  login(user, pass) {
    const response = fetch('https://sigrh.sea.sc.gov.br/login', {
      method: 'POST',
      body: { user, pass }
    })
    return response.json()
  }
}
```

### Encaixe no Projeto
```javascript
// DEPOIS: em sigrh-connector.js
class SIGRHConnector {
  constructor(config) {
    this.sigrh = new MeuSIGRH() // Suas classes
  }
  
  async login(username, password) {
    const result = this.sigrh.login(username, password)
    return {
      success: result.success,
      sessionId: result.session
    }
  }
}
```

---

## 🔌 INTEGRAÇÃO PASSO A PASSO

### Passo 1: Importar Seus Códigos
```javascript
// Em backend/src/routes/api.js
import MeuSIGRHAdapter from '../suas-pastas/sigrh.js'
import MeuInterpreterOficio from '../suas-pastas/interpreter.js'
import MeuGerador from '../suas-pastas/pdf-generator.js'
import MeuPGENet from '../suas-pastas/pgenet.js'
```

### Passo 2: Instanciar
```javascript
const sigrhConnector = new MeuSIGRHAdapter({
  url: process.env.SIGRH_URL,
  credentials: { /* seus dados */ }
})

const oficioInterpreter = new MeuInterpreterOficio()
const responseGenerator = new MeuGerador()
const pgenetConnector = new MeuPGENet({
  url: process.env.PGENET_URL
})
```

### Passo 3: Usar nas Rotas
```javascript
router.post('/workflow/completo', async (req, res) => {
  const { cpf, numero_processo, oficio } = req.body
  
  // 1. Seu SIGRH extrair dados
  const dados = await sigrhConnector.extrairProcessoCompleto(cpf, numero_processo)
  
  // 2. Seu interpretador analisar
  const analise = oficioInterpreter.processar(oficio)
  
  // 3. Seu gerador criar PDF
  const resposta = await responseGenerator.processarEGerar(dados, analise.tipo)
  
  // 4. Seu PGENet enviar
  const enviado = await pgenetConnector.enviarResposta(resposta.pdf)
  
  res.json({ success: enviado.success })
})
```

---

## 🚀 PARA COMEÇAR AGORA

### Opção A: Usar Código Existente (RECOMENDADO)

1. **Copie seu código SIGRH** → `backend/src/integrations/sigrh-connector.js`
2. **Adapte as interfaces** para que os métodos retornem no formato esperado
3. **Teste cada endpoint** isoladamente
4. **Ative o workflow completo**

### Opção B: Começar do Zero com Template

1. Use os templates já criados neste repositório
2. Preencha os métodos com seu código
3. Teste gradualmente

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Copiar código SIGRH para `sigrh-connector.js`
- [ ] Copiar código de interpretação de ofícios
- [ ] Copiar código de geração de PDF
- [ ] Criar `pgenet-connector.js` com seu código PGENet
- [ ] Testar cada método isoladamente
- [ ] Testar rota `/api/workflow/completo`
- [ ] Testar no frontend (Dashboard)
- [ ] Validar PDFs gerados
- [ ] Fazer deploy

---

## 🆘 DÚVIDAS?

Se seu código tem uma assinatura diferente, adapte assim:

```javascript
// Seu método antigo
function obterDados(cpf, callback) {
  const dados = buscarSIGRH(cpf)
  callback(dados)
}

// Adapte para Promise
async function obterDados(cpf) {
  return new Promise((resolve) => {
    function callback(dados) {
      resolve(dados)
    }
    buscarSIGRH(cpf, callback)
  })
}

// Ou use async/await direto
async obterDados(cpf) {
  const dados = await buscarSIGRH(cpf) // se já for async
  return dados
}
```

---

## 📞 ARQUITETURA FINAL

```
Frontend (React)
      ↓
   LOGIN
      ↓
    Dashboard
      ↓
  [Seu Código SIGRH]
      ↓
  [Seu Interpretador]
      ↓
  [Seu Gerador PDF]
      ↓
  [Seu Código PGENet]
      ↓
   Resposta Enviada ✅
```

**Tudo já está pronto para receber seus códigos!**
