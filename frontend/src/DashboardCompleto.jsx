import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './DashboardCompleto.css'

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
    <Container className="login-container">
      <Row className="h-100 d-flex align-items-center justify-content-center">
        <Col md={6}>
          <Card className="login-card p-5">
            <div className="text-center mb-4">
              <h1>🔗 Integrador SIGRH + PGENet</h1>
              <p className="text-muted">Autenticação Integrada</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>📧 Usuário SIGRH</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="usuario@sigrh.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>🔐 Senha SIGRH</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fs-5"
                disabled={loading}
              >
                {loading ? '🔄 Autenticando...' : '✅ Entrar'}
              </Button>
            </Form>

            <hr />
            <p className="text-center text-muted small">
              💡 Use qualquer email/senha para testar<br/>
              Este é um ambiente de demonstração
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

function Dashboard({ user, token, onLogout }) {
  const [oficios, setOficios] = useState([])
  const [processos, setProcessos] = useState([])
  const [stats, setStats] = useState({
    processosEmAndamento: 0,
    oficiosRecebidos: 0,
    pdfGerados: 0,
    ultimaSincronizacao: ''
  })
  const [loading, setLoading] = useState(true)
  const [processandoId, setProcessandoId] = useState(null)
  const [sucessoMsg, setSucessoMsg] = useState('')

  useEffect(() => {
    carregarDados()
  }, [])

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
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const processarOficio = async (oficio) => {
    try {
      setProcessandoId(oficio.id)
      setSucessoMsg('')

      const response = await fetch(`${API_URL}/api/workflow/completo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cpf: oficio.cpf,
          numero_processo: oficio.numero_processo,
          oficio: {
            id: oficio.id,
            numero: oficio.numero,
            assunto: oficio.assunto,
            conteudo: oficio.conteudo,
            data_recebimento: oficio.data_recebimento,
            prazo_resposta: oficio.prazo_resposta
          }
        })
      })

      if (!response.ok) throw new Error('Erro ao processar')

      const data = await response.json()

      // Atualizar ofício
      setOficios(oficios.map(o =>
        o.id === oficio.id
          ? { ...o, status: 'respondido', pdf_gerado: data.workflow.etapa_3_resposta.pdf.nome }
          : o
      ))

      setSucessoMsg(`✅ Ofício ${oficio.numero} processado com sucesso!`)
      setTimeout(() => setSucessoMsg(''), 5000)
    } catch (error) {
      alert(`❌ Erro: ${error.message}`)
    } finally {
      setProcessandoId(null)
    }
  }

  return (
    <div className="dashboard-bg">
      <nav className="navbar navbar-dark bg-dark">
        <Container fluid>
          <span className="navbar-brand mb-0 h1">🔗 Integrador SIGRH + PGENet</span>
          <div>
            <span className="text-light me-3">👤 {user.email}</span>
            <Button variant="outline-light" size="sm" onClick={onLogout}>
              🚪 Sair
            </Button>
          </div>
        </Container>
      </nav>

      <Container fluid className="dashboard-container p-4">
        <Row className="mb-4">
          <Col>
            <h2>📊 Dashboard de Integração</h2>
            <p className="text-muted">Gerencia ofícios e processos SIGRH + PGENet</p>
          </Col>
        </Row>

        {sucessoMsg && <Alert variant="success" dismissible onClose={() => setSucessoMsg('')}>{sucessoMsg}</Alert>}

        {/* Cards de Estatísticas */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="stat-card h-100">
              <Card.Body className="text-center">
                <div className="stat-icon">📋</div>
                <h6>Processos</h6>
                <h2 className="stat-number">{stats.processosEmAndamento}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card h-100">
              <Card.Body className="text-center">
                <div className="stat-icon">📧</div>
                <h6>Ofícios</h6>
                <h2 className="stat-number">{stats.oficiosRecebidos}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card h-100">
              <Card.Body className="text-center">
                <div className="stat-icon">📄</div>
                <h6>PDFs Gerados</h6>
                <h2 className="stat-number">{stats.pdfGerados}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card h-100">
              <Card.Body className="text-center">
                <div className="stat-icon">✅</div>
                <h6>Taxa Sucesso</h6>
                <h2 className="stat-number">100%</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Ofícios Pendentes */}
        <Row className="mb-4">
          <Col>
            <Card className="processos-card">
              <Card.Header className="card-header-custom">
                <h5 className="mb-0">📧 Ofícios Pendentes de Resposta</h5>
                <Badge bg="warning">{oficios.filter(o => o.status === 'pendente').length}</Badge>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-4">
                    <Spinner animation="border" className="me-2" /> Carregando...
                  </div>
                ) : oficios.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Número</th>
                          <th>Assunto</th>
                          <th>Tipo</th>
                          <th>Servidor</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oficios.map((oficio) => (
                          <tr key={oficio.id}>
                            <td><strong>{oficio.numero}</strong></td>
                            <td>{oficio.assunto.substring(0, 40)}...</td>
                            <td>
                              <Badge bg={oficio.tipo === 'cumprimento' ? 'success' : 'warning'}>
                                {oficio.tipo === 'cumprimento' ? '✓ Cumprimento' : '⚖ Instrução'}
                              </Badge>
                            </td>
                            <td>{oficio.servidor}</td>
                            <td>
                              <Badge bg={oficio.status === 'pendente' ? 'danger' : 'success'}>
                                {oficio.status === 'pendente' ? 'Pendente' : '✅ Respondido'}
                              </Badge>
                            </td>
                            <td>
                              {oficio.status === 'pendente' ? (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => processarOficio(oficio)}
                                  disabled={processandoId === oficio.id}
                                >
                                  {processandoId === oficio.id ? '⏳ Processando...' : '⚙️ Processar'}
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline-success" disabled>
                                  ✅ Feito
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert variant="info">ℹ️ Nenhum ofício pendente no momento</Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Processos Ativos */}
        <Row>
          <Col>
            <Card className="processos-card">
              <Card.Header className="card-header-custom">
                <h5 className="mb-0">📋 Processos Ativos (SIGRH)</h5>
                <Badge bg="info">{processos.length}</Badge>
              </Card.Header>
              <Card.Body>
                {processos.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Número</th>
                          <th>Servidor</th>
                          <th>Tipo</th>
                          <th>Status</th>
                          <th>Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processos.slice(0, 5).map((processo) => (
                          <tr key={processo.id}>
                            <td><strong>{processo.numero}</strong></td>
                            <td>{processo.servidor}</td>
                            <td>{processo.tipo}</td>
                            <td><Badge bg="success">✓ Ativo</Badge></td>
                            <td>{new Date(processo.data_abertura).toLocaleDateString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert variant="info">ℹ️ Nenhum processo ativo</Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return token && user ? (
    <Dashboard user={user} token={token} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  )
}
