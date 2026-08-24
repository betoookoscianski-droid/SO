import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// DADOS MOCK - SIMULAÇÃO DE BANCO DE DADOS
// ============================================

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

// ============================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_secret_aqui');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// ============================================
// ROTAS DE AUTENTICAÇÃO
// ============================================

app.post('/api/auth/login', (req, res) => {
  try {
    const { sigrh_user, sigrh_pass } = req.body;

    if (!sigrh_user || !sigrh_pass) {
      return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
    }

    // Simulação de autenticação bem-sucedida
    const token = jwt.sign(
      {
        user: sigrh_user,
        email: sigrh_user,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000
      },
      process.env.JWT_SECRET || 'seu_secret_aqui'
    );

    res.json({
      success: true,
      token: token,
      user: {
        email: sigrh_user,
        name: sigrh_user.split('@')[0]
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/validate', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// ============================================
// ROTAS DE OFÍCIOS
// ============================================

app.get('/api/oficios', authMiddleware, (req, res) => {
  res.json(mockOficios);
});

app.get('/api/oficio/:id', authMiddleware, (req, res) => {
  const oficio = mockOficios.find(o => o.id === req.params.id);
  if (!oficio) {
    return res.status(404).json({ error: 'Ofício não encontrado' });
  }
  res.json(oficio);
});

// ============================================
// ROTAS DE PROCESSOS
// ============================================

app.get('/api/processos', authMiddleware, (req, res) => {
  res.json(mockProcessos);
});

// ============================================
// ROTAS SIGRH (SIMULAÇÃO)
// ============================================

app.get('/api/sigrh/menus', authMiddleware, (req, res) => {
  res.json({
    success: true,
    menus: [
      { id: 'processos', nome: 'Processos Administrativos' },
      { id: 'fichas', nome: 'Fichas Funcionais' },
      { id: 'calculos', nome: 'Cálculos e Vencimentos' },
      { id: 'documentos', nome: 'Documentos' }
    ]
  });
});

app.get('/api/sigrh/ficha/:cpf', authMiddleware, (req, res) => {
  const { cpf } = req.params;
  const servidor = mockServidores[cpf];

  if (!servidor) {
    return res.status(404).json({ error: 'Servidor não encontrado' });
  }

  res.json({
    success: true,
    ficha: {
      dados_pessoais: {
        nome: servidor.nome,
        cpf: servidor.cpf,
        data_nascimento: servidor.data_nascimento
      },
      dados_funcionais: {
        matricula: servidor.matricula,
        cargo: servidor.cargo,
        lotacao: servidor.lotacao,
        data_admissao: servidor.data_admissao,
        status: servidor.ativo ? 'ATIVO' : 'INATIVO'
      }
    }
  });
});

app.get('/api/sigrh/calculos/:cpf', authMiddleware, (req, res) => {
  const { cpf } = req.params;
  const servidor = mockServidores[cpf];

  if (!servidor) {
    return res.status(404).json({ error: 'Servidor não encontrado' });
  }

  res.json({
    success: true,
    calculos: {
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      salario_base: servidor.salario_base,
      gratificacoes: servidor.gratificacoes,
      descontos: servidor.descontos,
      total_bruto: servidor.total_bruto,
      total_liquido: servidor.total_liquido,
      data_calculo: new Date().toISOString()
    }
  });
});

app.get('/api/sigrh/historico/:cpf', authMiddleware, (req, res) => {
  res.json({
    success: true,
    historico: [
      { data: '2024-01-25', evento: 'Acesso ao sistema', responsavel: 'Sistema SIGRH' },
      { data: '2024-01-24', evento: 'Cálculo de vencimentos', responsavel: 'Sistema Automático' },
      { data: '2024-01-20', evento: 'Abertura de processo', responsavel: 'Usuário' }
    ]
  });
});

app.get('/api/sigrh/completo/:cpf/:numero_processo', authMiddleware, (req, res) => {
  const { cpf, numero_processo } = req.params;
  const servidor = mockServidores[cpf];

  if (!servidor) {
    return res.status(404).json({ error: 'Dados não encontrados' });
  }

  const processo = mockProcessos.find(p => p.numero === numero_processo);

  res.json({
    success: true,
    dados_consolidados: {
      ficha: {
        dados_pessoais: {
          nome: servidor.nome,
          cpf: servidor.cpf,
          data_nascimento: servidor.data_nascimento
        },
        dados_funcionais: {
          matricula: servidor.matricula,
          cargo: servidor.cargo,
          lotacao: servidor.lotacao,
          data_admissao: servidor.data_admissao,
          status: servidor.ativo ? 'ATIVO' : 'INATIVO'
        }
      },
      calculos: {
        salario_base: servidor.salario_base,
        gratificacoes: servidor.gratificacoes,
        descontos: servidor.descontos,
        total_bruto: servidor.total_bruto,
        total_liquido: servidor.total_liquido
      },
      historico: [
        { data: '2024-01-25', evento: 'Processamento via integrador' },
        { data: '2024-01-20', evento: 'Abertura do processo' }
      ],
      processo: processo || { numero: numero_processo, status: 'Ativo' },
      timestamp: new Date().toISOString()
    }
  });
});

// ============================================
// ROTAS DE INTERPRETAÇÃO E GERAÇÃO
// ============================================

app.post('/api/oficio/interpretar', authMiddleware, (req, res) => {
  const { oficio } = req.body;

  const conteudoLower = oficio.conteudo.toLowerCase();
  const ehCumprimento = conteudoLower.includes('informar') || conteudoLower.includes('confirmar');

  res.json({
    success: true,
    interpretacao: {
      oficio_id: oficio.id,
      numero_oficio: oficio.numero,
      tipo_identificado: ehCumprimento ? 'cumprimento' : 'instrucao',
      confianca_tipo: 0.95,
      descricao: ehCumprimento ? 'Ofício de cumprimento' : 'Ofício de instrução',
      campos_necessarios: {
        dados_pessoais: ['nome', 'cpf'],
        dados_funcionais: ['matricula', 'cargo'],
        calculos: ['salario_base'],
        documentos: ['historico']
      }
    }
  });
});

app.post('/api/resposta/gerar', authMiddleware, (req, res) => {
  const { dados, tipo_oficio } = req.body;

  const pdf_nome = `resposta_${dados.oficio.numero}_${Date.now()}.pdf`;

  res.json({
    success: true,
    resposta: {
      sucesso: true,
      tipo: tipo_oficio,
      pdf: {
        nome: pdf_nome,
        caminho: `/pdfs/${pdf_nome}`,
        url: `/uploads/respostas/${pdf_nome}`
      },
      timestamp: new Date().toISOString()
    }
  });
});

// ============================================
// ROTA WORKFLOW COMPLETO
// ============================================

app.post('/api/workflow/completo', authMiddleware, (req, res) => {
  try {
    const { cpf, numero_processo, oficio } = req.body;

    console.log('🔄 [WORKFLOW] Iniciando fluxo completo...');

    // Simula processamento
    const servidor = mockServidores[cpf];
    if (!servidor) {
      return res.status(400).json({ error: 'CPF não encontrado' });
    }

    const conteudoLower = oficio.conteudo.toLowerCase();
    const tipo = conteudoLower.includes('informar') || conteudoLower.includes('confirmar')
      ? 'cumprimento'
      : 'instrucao';

    const pdfNome = `resposta_${oficio.numero}_${Date.now()}.pdf`;

    res.json({
      success: true,
      workflow: {
        etapa_1_sigrh: {
          status: 'concluída',
          dados: {
            servidor: servidor.nome,
            cpf: servidor.cpf,
            cargo: servidor.cargo,
            salario: servidor.total_liquido
          }
        },
        etapa_2_interpretacao: {
          status: 'concluída',
          tipo: tipo,
          campos_necessarios: {
            dados_pessoais: ['nome', 'cpf'],
            dados_funcionais: ['matricula', 'cargo'],
            calculos: ['salario_base']
          }
        },
        etapa_3_resposta: {
          status: 'concluída',
          tipo: tipo,
          pdf: {
            nome: pdfNome,
            url: `/pdfs/${pdfNome}`
          },
          conteudo_preview: `Resposta ${tipo === 'cumprimento' ? 'simples' : 'jurídica'} para ${servidor.nome}`
        },
        timestamp_conclusao: new Date().toISOString()
      }
    });

    // Atualizar status do ofício
    const oficio_obj = mockOficios.find(o => o.numero === oficio.numero);
    if (oficio_obj) {
      oficio_obj.status = 'respondido';
      oficio_obj.pdf_gerado = pdfNome;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROTAS DE ESTATÍSTICAS
// ============================================

app.get('/api/stats', authMiddleware, (req, res) => {
  const processosEmAndamento = mockProcessos.length;
  const oficiosRecebidos = mockOficios.length;
  const pdfGerados = mockOficios.filter(o => o.pdf_gerado).length;

  res.json({
    processosEmAndamento,
    oficiosRecebidos,
    pdfGerados,
    ultimaSincronizacao: new Date(Date.now() - 3600000).toLocaleString('pt-BR')
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    servidor: '✅ Backend funcionando',
    oficios: `✅ ${mockOficios.length} ofícios carregados`,
    processos: `✅ ${mockProcessos.length} processos carregados`
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
✅ 🚀 SERVIDOR BACKEND FUNCIONANDO!`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`\n📋 Ofícios disponíveis: ${mockOficios.length}`);
  console.log(`📁 Processos disponíveis: ${mockProcessos.length}`);
  console.log(`👥 Servidores cadastrados: ${Object.keys(mockServidores).length}\n`);
});

export default app;
