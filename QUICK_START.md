# 🚀 QUICK START - Comece Agora!

## 1️⃣ Clone e Configure

```bash
# Clone o repositório
git clone <url-repo>
cd SO

# Crie a branch de trabalho
git checkout feature/dashboard-ui
```

## 2️⃣ Backend - Setup

```bash
cd backend

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Edite .env com suas credenciais:
# SIGRH_URL=https://sigrh.sea.sc.gov.br
# SIGRH_USERNAME=seu_usuario
# SIGRH_PASSWORD=sua_senha
# PGENET_URL=https://pgenet.sea.sc.gov.br
# JWT_SECRET=sua_chave_secreta

# Inicie o servidor
npm run dev
# Rodará em http://localhost:5000
```

## 3️⃣ Frontend - Setup

```bash
cd frontend

# Instale dependências
npm install

# Inicie o desenvolvimento
npm run dev
# Rodará em http://localhost:5173
```

## 4️⃣ Teste a Integração

### Via Frontend
1. Abra `http://localhost:5173`
2. Faça login com credenciais SIGRH
3. Veja ofícios pendentes no dashboard
4. Clique em "Processar" para ativar workflow

### Via cURL (teste backend)
```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "sigrh_user": "seu_usuario",
    "sigrh_pass": "sua_senha",
    "pgenet_user": "seu_usuario",
    "pgenet_pass": "sua_senha"
  }'

# Copie o token retornado

# 2. Testar SIGRH
curl -X GET http://localhost:5000/api/sigrh/menus \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 3. Testar Workflow Completo
curl -X POST http://localhost:5000/api/workflow/completo \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "123.456.789-01",
    "numero_processo": "0001234-56.2024.8.24.0001",
    "oficio": {
      "numero": "OFC/2024/00001",
      "assunto": "Informar dados funcionais",
      "conteudo": "Solicita-se confirmar dados do servidor...",
      "data_recebimento": "2024-01-22",
      "prazo_resposta": 10
    }
  }'
```

## 5️⃣ Próximos Passos

1. **Copie seus códigos** → Veja `COMO_ENCAIXAR_SEUS_CODIGOS.md`
2. **Adapte as interfaces** para que funcionem com as rotas
3. **Teste isoladamente** cada módulo
4. **Ative o workflow** no dashboard
5. **Deploy** em produção

---

## 📁 Estrutura do Projeto

```
SO/
├── backend/
│   ├── src/
│   │   ├── integrations/     ← Encaixe seus códigos aqui
│   │   │   ├── sigrh-connector.js
│   │   │   ├── oficio-interpreter.js
│   │   │   ├── response-generator.js
│   │   │   └── pgenet-connector.js
│   │   ├── routes/
│   │   │   └── api.js        ← Endpoints prontos
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx   ← Interface do usuário
│   │   ├── services/
│   │   │   └── apiClient.js
│   │   └── contexts/
│   │       └── AuthContext.jsx
│   └── package.json
│
├── docs/
│   ├── INSTALACAO.md
│   ├── API.md
│   └── FLUXO_COMPLETO.md
│
├── FLUXO_COMPLETO.md
├── ROADMAP.md
├── COMO_ENCAIXAR_SEUS_CODIGOS.md
└── README.md
```

---

## 🔐 Variáveis de Ambiente Necessárias

```env
# Backend (.env)
NODE_ENV=development
PORT=5000

# SIGRH
SIGRH_URL=https://sigrh.sea.sc.gov.br
SIGRH_USERNAME=seu_usuario_sigrh
SIGRH_PASSWORD=sua_senha_sigrh

# PGENet
PGENET_URL=https://pgenet.sea.sc.gov.br
PGENET_USERNAME=seu_usuario_pgenet
PGENET_PASSWORD=sua_senha_pgenet

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui

# PDF
PDF_DIR=./pdfs
```

---

## ✅ Verificação Rápida

```bash
# Backend rodando?
curl http://localhost:5000/health
# Resposta esperada: {"status":"ok", ...}

# Frontend rodando?
# Abra http://localhost:5173 no navegador

# Ambos OK? Você está pronto!
```

---

## 🆘 Problemas Comuns

### "Cannot find module"
```bash
# Solução
cd backend
rm -rf node_modules
npm install
```

### "CORS Error"
```bash
# Verifique em .env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### "401 Unauthorized"
```bash
# Verifique se JWT_SECRET está definido
# Verifique se token está sendo enviado corretamente
```

---

**🎉 Pronto! Agora encaixe seus códigos e comece a usar!**
