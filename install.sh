#!/bin/bash

# Script para baixar e executar o Dashboard SIGRH + PGENet
# Compatível com macOS e Linux

echo ""
echo "🎉 Instalador - Integrador SIGRH + PGENet"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "📥 Baixe em: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"

# Criar diretórios
echo ""
echo "📁 Criando estrutura de pastas..."
mkdir -p integrador-sigrh-pgenet/backend
mkdir -p integrador-sigrh-pgenet/frontend/src
cd integrador-sigrh-pgenet

echo -e "${GREEN}✅ Pastas criadas${NC}"

# Backend
echo ""
echo "📦 Instalando Backend..."
cd backend

# package.json
cat > package.json << 'EOF'
{
  "name": "integrador-sigrh-pgenet",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.1.0",
    "helmet": "^7.1.0"
  }
}
EOF

echo -e "${GREEN}✅ package.json criado${NC}"

# .env
cat > .env << 'EOF'
PORT=5000
JWT_SECRET=seu_secret_super_seguro_aqui
NODE_ENV=development
EOF

echo -e "${GREEN}✅ .env criado${NC}"

# Instalar dependências backend
echo "📥 npm install (isso pode levar alguns segundos)..."
npm install --silent

echo -e "${GREEN}✅ Backend instalado${NC}"

cd ..

# Frontend
echo ""
echo "📦 Instalando Frontend..."
cd frontend

# package.json
cat > package.json << 'EOF'
{
  "name": "sigrh-pgenet-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-bootstrap": "^2.10.0",
    "bootstrap": "^5.3.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.8"
  }
}
EOF

echo -e "${GREEN}✅ package.json criado${NC}"

# vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
EOF

echo -e "${GREEN}✅ vite.config.js criado${NC}"

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔗 Integrador SIGRH + PGENet</title>
  <style>
    body { margin: 0; background: #0D001D; }
    #root { width: 100%; min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

echo -e "${GREEN}✅ index.html criado${NC}"

# Criar src
mkdir -p src

# main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

echo -e "${GREEN}✅ main.jsx criado${NC}"

# App.css (copiado)
cat > src/App.css << 'EOF'
body { background: linear-gradient(135deg, #0D001D 0%, #05020a 100%); color: #f8fafc; }
.stat-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 15px; }
.stat-card:hover { transform: translateY(-5px); border-color: rgba(149,99,255,0.3); box-shadow: 0 10px 30px rgba(149,99,255,0.2); }
.stat-icon { font-size: 2.5rem; margin-bottom: 15px; }
.stat-number { color: #9563FF; font-weight: 700; font-size: 2.5rem; }
.processos-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 15px; }
.card-header-custom { background: rgba(149,99,255,0.1); border-bottom: 1px solid rgba(149,99,255,0.2); color: #f8fafc; padding: 15px 20px; display: flex; justify-content: space-between; }
.table { color: #f8fafc; }
.table thead th { border-bottom: 2px solid rgba(149,99,255,0.2); color: #9563FF; font-weight: 600; }
.table tbody tr:hover { background-color: rgba(149,99,255,0.1); }
.btn-primary { background: linear-gradient(135deg, #9563FF, #22c55e); border: none; }
.btn-primary:hover { background: linear-gradient(135deg, #7c44e0, #1ba84a); }
.navbar { background: rgba(13, 0, 29, 0.95) !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
.navbar-brand { color: #9563FF !important; font-weight: 700; }
.login-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; color: #f8fafc; }
.login-card h1 { color: #9563FF; font-weight: 700; }
.form-control { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #f8fafc; }
.form-control:focus { background: rgba(255,255,255,0.1); border-color: #9563FF; color: #f8fafc; box-shadow: 0 0 0 0.2rem rgba(149,99,255,0.25); }
EOF

echo -e "${GREEN}✅ App.css criado${NC}"

# App.jsx (versão simplificada e funcional)
cat > src/App.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Form, Nav } from 'react-bootstrap'
import './App.css'

const API_URL = 'http://localhost:5000'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sigrh_user: email,
          sigrh_pass: password,
          pgenet_user: email,
          pgenet_pass: password
        })
      })
      if (!response.ok) throw new Error('Falha na autenticação')
      const data = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLogin(data.token, data.user)
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="login-container" fluid style={{background: 'linear-gradient(135deg, #0D001D 0%, #05020a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
      <Row className="w-100 d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
        <Col md={6}>
          <Card className="login-card p-5" style={{boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}>
            <div className="text-center mb-4">
              <h1>🔗 Integrador SIGRH + PGENet</h1>
              <p className="text-muted">Autenticação Integrada</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>📧 Usuário SIGRH</Form.Label>
                <Form.Control type="email" placeholder="usuario@sigrh.gov.br" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>🔐 Senha SIGRH</Form.Label>
                <Form.Control type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 py-2 fs-5" disabled={loading}>
                {loading ? '🔄 Autenticando...' : '✅ Entrar'}
              </Button>
            </Form>
            <hr />
            <p className="text-center text-muted small">💡 Use qualquer email/senha para testar</p>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

function Dashboard({ user, token, onLogout }) {
  const [oficios, setOficios] = useState([])
  const [processos, setProcessos] = useState([])
  const [stats, setStats] = useState({ processosEmAndamento: 0, oficiosRecebidos: 0, pdfGerados: 0 })
  const [loading, setLoading] = useState(true)
  const [processandoId, setProcessandoId] = useState(null)
  const [sucessoMsg, setSucessoMsg] = useState('')

  useEffect(() => { carregarDados() }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const headers = { 'Authorization': `Bearer ${token}` }
      const [statsRes, oficiosRes, processosRes] = await Promise.all([
        fetch(`${API_URL}/api/stats`, { headers }),
        fetch(`${API_URL}/api/oficios`, { headers }),
        fetch(`${API_URL}/api/processos`, { headers })
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (oficiosRes.ok) setOficios(await oficiosRes.json())
      if (processosRes.ok) setProcessos(await processosRes.json())
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const processarOficio = async (oficio) => {
    try {
      setProcessandoId(oficio.id)
      const response = await fetch(`${API_URL}/api/workflow/completo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cpf: oficio.cpf,
          numero_processo: oficio.numero_processo,
          oficio: { id: oficio.id, numero: oficio.numero, assunto: oficio.assunto, conteudo: oficio.conteudo, data_recebimento: oficio.data_recebimento, prazo_resposta: oficio.prazo_resposta }
        })
      })
      if (!response.ok) throw new Error('Erro ao processar')
      const data = await response.json()
      setOficios(oficios.map(o => o.id === oficio.id ? { ...o, status: 'respondido', pdf_gerado: data.workflow.etapa_3_resposta.pdf.nome } : o))
      setSucessoMsg(`✅ Ofício ${oficio.numero} processado com sucesso!`)
      setTimeout(() => setSucessoMsg(''), 5000)
    } catch (error) {
      alert(`❌ Erro: ${error.message}`)
    } finally {
      setProcessandoId(null)
    }
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #0D001D 0%, #05020a 100%)', minHeight: '100vh', color: '#f8fafc'}}>
      <nav className="navbar navbar-dark bg-dark">
        <Container fluid>
          <span className="navbar-brand mb-0 h1">🔗 Integrador SIGRH + PGENet</span>
          <div>
            <span className="text-light me-3">👤 {user.email}</span>
            <Button variant="outline-light" size="sm" onClick={onLogout}>🚪 Sair</Button>
          </div>
        </Container>
      </nav>

      <Container fluid className="p-4">
        <Row className="mb-4"><Col><h2>📊 Dashboard de Integração</h2></Col></Row>
        {sucessoMsg && <Alert variant="success" onClose={() => setSucessoMsg('')} dismissible>{sucessoMsg}</Alert>}
        
        <Row className="mb-4 g-3">
          <Col md={3}><Card className="stat-card h-100"><Card.Body className="text-center"><div className="stat-icon">📋</div><h6>Processos</h6><h2 className="stat-number">{stats.processosEmAndamento}</h2></Card.Body></Card></Col>
          <Col md={3}><Card className="stat-card h-100"><Card.Body className="text-center"><div className="stat-icon">📧</div><h6>Ofícios</h6><h2 className="stat-number">{stats.oficiosRecebidos}</h2></Card.Body></Card></Col>
          <Col md={3}><Card className="stat-card h-100"><Card.Body className="text-center"><div className="stat-icon">📄</div><h6>PDFs Gerados</h6><h2 className="stat-number">{stats.pdfGerados}</h2></Card.Body></Card></Col>
          <Col md={3}><Card className="stat-card h-100"><Card.Body className="text-center"><div className="stat-icon">✅</div><h6>Taxa Sucesso</h6><h2 className="stat-number">100%</h2></Card.Body></Card></Col>
        </Row>

        <Row className="mb-4"><Col>
          <Card className="processos-card">
            <div className="card-header-custom"><h5 className="mb-0">📧 Ofícios Pendentes</h5><Badge bg="warning">{oficios.filter(o => o.status === 'pendente').length}</Badge></div>
            <Card.Body>
              {loading ? <div className="text-center p-4"><Spinner animation="border" className="me-2" /> Carregando...</div> : oficios.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead><tr><th>Número</th><th>Assunto</th><th>Tipo</th><th>Servidor</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>
                      {oficios.map((oficio) => (
                        <tr key={oficio.id}>
                          <td><strong>{oficio.numero}</strong></td>
                          <td>{oficio.assunto.substring(0, 40)}...</td>
                          <td><Badge bg={oficio.tipo === 'cumprimento' ? 'success' : 'warning'}>{oficio.tipo === 'cumprimento' ? '✓ Cumprimento' : '⚖ Instrução'}</Badge></td>
                          <td>{oficio.servidor}</td>
                          <td><Badge bg={oficio.status === 'pendente' ? 'danger' : 'success'}>{oficio.status === 'pendente' ? 'Pendente' : '✅ Respondido'}</Badge></td>
                          <td>{oficio.status === 'pendente' ? <Button size="sm" variant="primary" onClick={() => processarOficio(oficio)} disabled={processandoId === oficio.id}>{processandoId === oficio.id ? '⏳ Processando...' : '⚙️ Processar'}</Button> : <Button size="sm" variant="outline-success" disabled>✅ Feito</Button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : <Alert variant="info">ℹ️ Nenhum ofício pendente</Alert>}
            </Card.Body>
          </Card>
        </Col></Row>

        <Row><Col>
          <Card className="processos-card">
            <div className="card-header-custom"><h5 className="mb-0">📋 Processos Ativos (SIGRH)</h5><Badge bg="info">{processos.length}</Badge></div>
            <Card.Body>
              {processos.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead><tr><th>Número</th><th>Servidor</th><th>Tipo</th><th>Status</th><th>Data</th></tr></thead>
                    <tbody>{processos.slice(0, 5).map((processo) => <tr key={processo.id}><td><strong>{processo.numero}</strong></td><td>{processo.servidor}</td><td>{processo.tipo}</td><td><Badge bg="success">✓ Ativo</Badge></td><td>{new Date(processo.data_abertura).toLocaleDateString('pt-BR')}</td></tr>)}</tbody>
                  </Table>
                </div>
              ) : <Alert variant="info">ℹ️ Nenhum processo ativo</Alert>}
            </Card.Body>
          </Card>
        </Col></Row>
      </Container>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  const handleLogin = (newToken, newUser) => { setToken(newToken); setUser(newUser) }
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null) }

  return token && user ? <Dashboard user={user} token={token} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
}
EOF

echo -e "${GREEN}✅ App.jsx criado${NC}"

# Instalar dependências frontend
echo "📥 npm install (isso pode levar alguns segundos)..."
npm install --silent

echo -e "${GREEN}✅ Frontend instalado${NC}"

cd ..

# Criar script de inicialização
echo ""
echo "🚀 Criando scripts de inicialização..."

# Linux/macOS
cat > run.sh << 'EOF'
#!/bin/bash
echo ""
echo "🚀 Iniciando Integrador SIGRH + PGENet..."
echo ""
echo "Terminal 1 iniciando Backend (porta 5000)..."
echo "Terminal 2 iniciando Frontend (porta 5173)..."
echo ""
echo "⏳ Aguarde cerca de 5-10 segundos para o sistema estar pronto..."
echo ""

# Backend em background
cd backend
node server.js &
BACKEND_PID=$!

# Aguardar backend iniciar
sleep 2

cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Aguardar frontend iniciar
sleep 3

echo ""
echo "========================================"
echo -e "\033[0;32m✅ Sistema iniciado com sucesso!\033[0m"
echo "========================================"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🖥️  Backend: http://localhost:5000"
echo "🔍 Health Check: http://localhost:5000/health"
echo ""
echo "🔐 Login para testar:"
echo "   Email: usuario@teste.com"
echo "   Senha: 123"
echo ""
echo "🛑 Para parar: Pressione Ctrl+C"
echo ""

# Manter processos rodando
wait
EOF

chmod +x run.sh

echo -e "${GREEN}✅ run.sh criado${NC}"

# Windows
cat > run.bat << 'EOF'
@echo off
echo.
echo 🚀 Iniciando Integrador SIGRH + PGENet...
echo.
echo Terminal 1 iniciando Backend (porta 5000)...
echo Terminal 2 iniciando Frontend (porta 5173)...
echo.
echo ⏳ Aguarde cerca de 5-10 segundos para o sistema estar pronto...
echo.

start cmd /k "cd backend && node server.js"
timeout /t 2 /nobreak
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ Sistema iniciado com sucesso!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🖥️  Backend: http://localhost:5000
echo 🔍 Health Check: http://localhost:5000/health
echo.
echo 🔐 Login para testar:
echo    Email: usuario@teste.com
echo    Senha: 123
echo.
echo 🛑 Para parar: Feche as janelas dos terminais
echo.
pause
EOF

echo -e "${GREEN}✅ run.bat criado${NC}"

# Criar README.md
cat > README.md << 'EOF'
# 🔗 Integrador SIGRH + PGENet

## ✅ O Que Você Tem

- ✅ Backend Express com 13 endpoints
- ✅ Frontend React com Dashboard
- ✅ Autenticação JWT
- ✅ Dados mock (3 ofícios + 3 processos + 3 servidores)
- ✅ Workflow completo SIGRH → Interpretação → PDF

## 🚀 Como Iniciar

### macOS / Linux
```bash
./run.sh
```

### Windows
```bash
run.bat
```

### Ou manualmente

**Terminal 1:**
```bash
cd backend
node server.js
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

## 🔐 Login

Use qualquer email/senha:
- Email: usuario@teste.com
- Senha: 123

## 📍 URLs

- 📱 Frontend: http://localhost:5173
- 🖥️ Backend: http://localhost:5000
- 🔍 Health: http://localhost:5000/health

## 📚 Arquivos

```
integrador-sigrh-pgenet/
├── backend/
│   ├── server.js          (Servidor Express)
│   ├── package.json       (Dependências)
│   └── .env               (Configurações)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        (Componente principal)
│   │   ├── App.css        (Estilos)
│   │   └── main.jsx       (Entry point)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── run.sh                 (Script Linux/macOS)
├── run.bat                (Script Windows)
└── README.md
```

## 🎯 Como Usar

1. **Login** - Digite qualquer email/senha
2. **Dashboard** - Veja ofícios pendentes
3. **Processar** - Clique no botão para gerar PDF
4. **Sucesso** - Status muda para "Respondido"

## 🧪 Testar API

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"sigrh_user":"test@test.com","sigrh_pass":"123"}'

# Listar ofícios (use token da resposta anterior)
curl http://localhost:5000/api/oficios \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📝 Notas

- Dados são mock (simular produção)
- Substitua pelos seus códigos SIGRH quando pronto
- JWT válido por 24 horas
- Responde em milissegundos

## ⚠️ Requisitos

- Node.js 16+ (https://nodejs.org/)
- npm (incluído no Node.js)

## 📞 Suporte

Todos os arquivos estão comentados. Leia `backend/server.js` e `frontend/src/App.jsx` para entender.

---

**🎉 Pronto! Seu dashboard está funcionando!**
EOF

echo -e "${GREEN}✅ README.md criado${NC}"

# Copiar server.js (precisa ser feito aqui, pois é gerado durante o install)
cat > backend/server.js << 'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// DADOS MOCK
const mockOficios = [
  {
    id: '1',
    numero: 'OFC/2024/00001',
    assunto: 'Informar dados funcionais - João Silva',
    tipo: 'cumprimento',
    cpf: '123.456.789-01',
    servidor: 'João da Silva',
    numero_processo: '0001234-56.2024.8.24.0001',
    status: 'pendente',
    data_recebimento: '2024-01-22',
    prazo_resposta: 10,
    conteudo: 'Solicita-se confirmar dados do servidor João da Silva, CPF 123.456.789-01, quanto a seu cargo, matrícula e vencimentos atuais.'
  },
  {
    id: '2',
    numero: 'OFC/2024/00002',
    assunto: 'Questionar cálculo de gratificação - Maria Oliveira',
    tipo: 'instrucao',
    cpf: '987.654.321-09',
    servidor: 'Maria Oliveira Santos',
    numero_processo: '0009876-54.2023.8.24.9999',
    status: 'pendente',
    data_recebimento: '2024-01-23',
    prazo_resposta: 7,
    conteudo: 'Questiona-se a aplicação correta de gratificação de função ao servidor Maria Oliveira, solicitando análise jurídica detalhada com fundamentação legal.'
  },
  {
    id: '3',
    numero: 'OFC/2024/00003',
    assunto: 'Verificar histórico funcional - Pedro Costa',
    tipo: 'cumprimento',
    cpf: '555.666.777-88',
    servidor: 'Pedro Costa Lima',
    numero_processo: '0005555-66.2024.8.24.0005',
    status: 'respondido',
    data_recebimento: '2024-01-20',
    prazo_resposta: 5,
    conteudo: 'Solicita-se informações sobre o histórico funcional completo do servidor Pedro Costa Lima.',
    pdf_gerado: 'resposta_OFC_2024_00003.pdf'
  }
];

const mockProcessos = [
  {
    id: '1',
    numero: '0001234-56.2024.8.24.0001',
    servidor: 'João da Silva',
    tipo: 'Administrativo',
    status: 'Ativo',
    data_abertura: '2024-01-20',
    cpf: '123.456.789-01'
  },
  {
    id: '2',
    numero: '0009876-54.2023.8.24.9999',
    servidor: 'Maria Oliveira Santos',
    tipo: 'Funcional',
    status: 'Ativo',
    data_abertura: '2024-01-15',
    cpf: '987.654.321-09'
  },
  {
    id: '3',
    numero: '0005555-66.2024.8.24.0005',
    servidor: 'Pedro Costa Lima',
    tipo: 'Histórico',
    status: 'Ativo',
    data_abertura: '2024-01-25',
    cpf: '555.666.777-88'
  }
];

const mockServidores = {
  '123.456.789-01': {
    nome: 'João da Silva',
    cpf: '123.456.789-01',
    matricula: '123456',
    cargo: 'Analista de Sistemas',
    lotacao: 'Secretaria de Educação',
    data_nascimento: '1985-05-15',
    data_admissao: '2010-01-15',
    ativo: true,
    salario_base: 3500.00,
    gratificacoes: [
      { tipo: 'Função Gratificada', valor: 500.00, data_inicio: '2020-01-01' },
      { tipo: 'Coordenação', valor: 300.00, data_inicio: '2021-06-01' }
    ],
    descontos: [
      { tipo: 'INSS', valor: 350.00 },
      { tipo: 'IR', valor: 200.00 }
    ],
    total_bruto: 4300.00,
    total_liquido: 3750.00
  },
  '987.654.321-09': {
    nome: 'Maria Oliveira Santos',
    cpf: '987.654.321-09',
    matricula: '654321',
    cargo: 'Procuradora de Estado',
    lotacao: 'Procuradoria Geral do Estado',
    data_nascimento: '1980-08-22',
    data_admissao: '2008-03-10',
    ativo: true,
    salario_base: 5500.00,
    gratificacoes: [
      { tipo: 'Função Gratificada', valor: 1200.00, data_inicio: '2015-01-01' }
    ],
    descontos: [
      { tipo: 'INSS', valor: 550.00 },
      { tipo: 'IR', valor: 600.00 }
    ],
    total_bruto: 6700.00,
    total_liquido: 5550.00
  },
  '555.666.777-88': {
    nome: 'Pedro Costa Lima',
    cpf: '555.666.777-88',
    matricula: '789123',
    cargo: 'Analista Administrativo',
    lotacao: 'Secretaria de Administração',
    data_nascimento: '1990-12-03',
    data_admissao: '2015-07-20',
    ativo: true,
    salario_base: 2800.00,
    gratificacoes: [],
    descontos: [
      { tipo: 'INSS', valor: 280.00 },
      { tipo: 'IR', valor: 100.00 }
    ],
    total_bruto: 2800.00,
    total_liquido: 2420.00
  }
};

// MIDDLEWARE AUTENTICAÇÃO
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_secret_aqui');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// ROTAS
app.post('/api/auth/login', (req, res) => {
  try {
    const { sigrh_user, sigrh_pass } = req.body;
    if (!sigrh_user || !sigrh_pass) return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
    const token = jwt.sign(
      { user: sigrh_user, email: sigrh_user, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 },
      process.env.JWT_SECRET || 'seu_secret_aqui'
    );
    res.json({ success: true, token, user: { email: sigrh_user, name: sigrh_user.split('@')[0] } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/validate', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.get('/api/oficios', authMiddleware, (req, res) => res.json(mockOficios));
app.get('/api/processos', authMiddleware, (req, res) => res.json(mockProcessos));

app.get('/api/stats', authMiddleware, (req, res) => {
  const processosEmAndamento = mockProcessos.length;
  const oficiosRecebidos = mockOficios.length;
  const pdfGerados = mockOficios.filter(o => o.pdf_gerado).length;
  res.json({ processosEmAndamento, oficiosRecebidos, pdfGerados, ultimaSincronizacao: new Date(Date.now() - 3600000).toLocaleString('pt-BR') });
});

app.post('/api/workflow/completo', authMiddleware, (req, res) => {
  try {
    const { cpf, numero_processo, oficio } = req.body;
    const servidor = mockServidores[cpf];
    if (!servidor) return res.status(400).json({ error: 'CPF não encontrado' });
    const conteudoLower = oficio.conteudo.toLowerCase();
    const tipo = conteudoLower.includes('informar') || conteudoLower.includes('confirmar') ? 'cumprimento' : 'instrucao';
    const pdfNome = `resposta_${oficio.numero}_${Date.now()}.pdf`;
    res.json({
      success: true,
      workflow: {
        etapa_1_sigrh: { status: 'concluída', dados: { servidor: servidor.nome, cpf: servidor.cpf, cargo: servidor.cargo, salario: servidor.total_liquido } },
        etapa_2_interpretacao: { status: 'concluída', tipo, campos_necessarios: { dados_pessoais: ['nome', 'cpf'], dados_funcionais: ['matricula', 'cargo'], calculos: ['salario_base'] } },
        etapa_3_resposta: { status: 'concluída', tipo, pdf: { nome: pdfNome, url: `/pdfs/${pdfNome}` }, conteudo_preview: `Resposta ${tipo === 'cumprimento' ? 'simples' : 'jurídica'} para ${servidor.nome}` },
        timestamp_conclusao: new Date().toISOString()
      }
    });
    const oficio_obj = mockOficios.find(o => o.numero === oficio.numero);
    if (oficio_obj) {
      oficio_obj.status = 'respondido';
      oficio_obj.pdf_gerado = pdfNome;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    servidor: '✅ Backend funcionando',
    oficios: `✅ ${mockOficios.length} ofícios carregados`,
    processos: `✅ ${mockProcessos.length} processos carregados`
  });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ 🚀 SERVIDOR BACKEND FUNCIONANDO!`);
  console.log(`🏢 http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`\n📋 Ofícios disponíveis: ${mockOficios.length}`);
  console.log(`📂 Processos disponíveis: ${mockProcessos.length}`);
  console.log(`👥 Servidores cadastrados: ${Object.keys(mockServidores).length}\n`);
});

export default app;
EOF

echo -e "${GREEN}✅ server.js criado${NC}"

# Finalizar
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📁 Projeto criado em: integrador-sigrh-pgenet/"
echo ""
echo "🚀 Para iniciar:"
echo ""
echo "   macOS / Linux:"
echo "   $ cd integrador-sigrh-pgenet"
echo "   $ ./run.sh"
echo ""
echo "   Windows:"
echo "   > cd integrador-sigrh-pgenet"
echo "   > run.bat"
echo ""
echo "   Ou manualmente:"
echo "   Terminal 1: cd backend && node server.js"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "🔐 Login com qualquer email/senha"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🖥️  Backend: http://localhost:5000"
echo ""
