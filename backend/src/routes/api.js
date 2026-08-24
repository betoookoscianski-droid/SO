/**
 * Rotas da API - Controladores principais
 * Integrando SIGRH → APP → PGENet
 */

import express from 'express';
import SIGRHConnector from '../integrations/sigrh-connector.js';
import OficioInterpreter from '../integrations/oficio-interpreter.js';
import ResponseGenerator from '../integrations/response-generator.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Instâncias dos integradores
const sigrhConnector = new SIGRHConnector({
  SIGRH_URL: process.env.SIGRH_URL,
  SIGRH_USERNAME: process.env.SIGRH_USERNAME,
  SIGRH_PASSWORD: process.env.SIGRH_PASSWORD
});

const oficioInterpreter = new OficioInterpreter();
const responseGenerator = new ResponseGenerator();

/**
 * POST /api/auth/login
 * Login integrado SIGRH + PGENet
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { sigrh_user, sigrh_pass, pgenet_user, pgenet_pass } = req.body;

    // Autentica no SIGRH
    const loginSIGRH = await sigrhConnector.login(sigrh_user, sigrh_pass);
    
    if (!loginSIGRH.success) {
      return res.status(401).json({
        success: false,
        error: 'Falha na autenticação SIGRH',
        details: loginSIGRH.error
      });
    }

    // Cria token JWT
    const token = require('jsonwebtoken').sign(
      {
        user: sigrh_user,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
      },
      process.env.JWT_SECRET
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
    res.status(500).json({
      success: false,
      error: 'Erro no servidor',
      details: error.message
    });
  }
});

/**
 * GET /api/auth/validate
 * Valida token JWT
 */
router.get('/auth/validate', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

/**
 * GET /api/sigrh/menus
 * Lista menus disponíveis no SIGRH
 */
router.get('/sigrh/menus', authMiddleware, async (req, res) => {
  try {
    const menus = await sigrhConnector.navegarMenus();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sigrh/processo/:numero
 * Abre um processo específico no SIGRH
 */
router.get('/sigrh/processo/:numero', authMiddleware, async (req, res) => {
  try {
    const { numero } = req.params;
    const processo = await sigrhConnector.abrirProcesso(numero);
    res.json(processo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sigrh/ficha/:cpf
 * Extrai ficha funcional do SIGRH
 */
router.get('/sigrh/ficha/:cpf', authMiddleware, async (req, res) => {
  try {
    const { cpf } = req.params;
    const ficha = await sigrhConnector.extrairFichaFuncional(cpf);
    res.json(ficha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sigrh/calculos/:cpf
 * Extrai cálculos de vencimentos do SIGRH
 */
router.get('/sigrh/calculos/:cpf', authMiddleware, async (req, res) => {
  try {
    const { cpf } = req.params;
    const { mes, ano } = req.query;
    const calculos = await sigrhConnector.extrairCalculos(cpf, mes, ano);
    res.json(calculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sigrh/historico/:cpf
 * Extrai histórico do servidor no SIGRH
 */
router.get('/sigrh/historico/:cpf', authMiddleware, async (req, res) => {
  try {
    const { cpf } = req.params;
    const historico = await sigrhConnector.extrairHistorico(cpf);
    res.json(historico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sigrh/completo/:cpf/:numero_processo
 * Extrai TUDO de um processo (completo)
 */
router.get('/sigrh/completo/:cpf/:numero_processo', authMiddleware, async (req, res) => {
  try {
    const { cpf, numero_processo } = req.params;
    const dados = await sigrhConnector.extrairProcessoCompleto(cpf, numero_processo);
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/oficio/interpretar
 * Interpreta um ofício (tipo, campos necessários, etc)
 */
router.post('/oficio/interpretar', authMiddleware, (req, res) => {
  try {
    const { oficio } = req.body;
    
    if (!oficio || !oficio.conteudo) {
      return res.status(400).json({
        error: 'Ofício deve conter campo "conteudo"'
      });
    }

    const interpretacao = oficioInterpreter.processar(oficio);
    
    res.json({
      success: true,
      interpretacao: interpretacao
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resposta/gerar
 * Gera resposta (cumprimento) ou parecer (instrução)
 */
router.post('/resposta/gerar', authMiddleware, async (req, res) => {
  try {
    const { dados, tipo_oficio } = req.body;
    
    if (!dados || !tipo_oficio) {
      return res.status(400).json({
        error: 'Dados e tipo_oficio são obrigatórios'
      });
    }

    const resultado = await responseGenerator.processarEGerar(dados, tipo_oficio);
    
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }

    res.json({
      success: true,
      resposta: resultado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/workflow/completo
 * Fluxo completo: SIGRH → Interpretação → Resposta
 */
router.post('/workflow/completo', authMiddleware, async (req, res) => {
  try {
    const { cpf, numero_processo, oficio } = req.body;

    console.log('📋 [WORKFLOW] Iniciando fluxo completo...');
    console.log(`   CPF: ${cpf}`);
    console.log(`   Processo: ${numero_processo}`);
    console.log(`   Ofício: ${oficio.numero}`);

    // ETAPA 1: Extrai dados do SIGRH
    console.log('\n1️⃣ Extraindo dados do SIGRH...');
    const dadosSIGRH = await sigrhConnector.extrairProcessoCompleto(cpf, numero_processo);
    
    if (!dadosSIGRH.success) {
      return res.status(400).json({
        error: 'Erro ao extrair dados do SIGRH',
        details: dadosSIGRH.error
      });
    }
    
    console.log('✅ Dados SIGRH extraídos com sucesso');

    // ETAPA 2: Interpreta ofício
    console.log('\n2️⃣ Interpretando ofício...');
    const interpretacao = oficioInterpreter.processar(oficio);
    console.log(`✅ Tipo identificado: ${interpretacao.tipo_identificado}`);
    console.log(`   Campos necessários: ${interpretacao.campos_necessarios.dados_pessoais.join(', ')}`);

    // ETAPA 3: Gera resposta/parecer
    console.log('\n3️⃣ Gerando resposta/parecer jurídico...');
    const resposta = await responseGenerator.processarEGerar(
      {
        servidor: dadosSIGRH.dados_consolidados.ficha?.dados_pessoais,
        oficio: oficio,
        calculos: dadosSIGRH.dados_consolidados.calculos,
        historico: dadosSIGRH.dados_consolidados.historico,
        processo: dadosSIGRH.dados_consolidados.processo
      },
      interpretacao.tipo_identificado
    );

    if (!resposta.sucesso) {
      return res.status(500).json({
        error: 'Erro ao gerar resposta',
        details: resposta.erro
      });
    }

    console.log('✅ Resposta gerada com sucesso');
    console.log(`   Arquivo: ${resposta.pdf.nome}`);

    // ETAPA 4: Retorna resultado completo
    res.json({
      success: true,
      workflow: {
        etapa_1_sigrh: {
          status: 'concluída',
          dados: dadosSIGRH.dados_consolidados
        },
        etapa_2_interpretacao: {
          status: 'concluída',
          tipo: interpretacao.tipo_identificado,
          campos_necessarios: interpretacao.campos_necessarios
        },
        etapa_3_resposta: {
          status: 'concluída',
          tipo: resposta.tipo,
          pdf: resposta.pdf,
          conteudo_preview: resposta.conteudo.substring(0, 500) + '...'
        },
        timestamp_conclusao: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro no workflow:', error);
    res.status(500).json({
      error: 'Erro no processamento do workflow',
      details: error.message
    });
  }
});

/**
 * GET /api/stats
 * Estatísticas do sistema
 */
router.get('/stats', authMiddleware, (req, res) => {
  res.json({
    processosEmAndamento: 15,
    oficiosRecebidos: 8,
    pdfGerados: 42,
    ultimaSincronizacao: new Date(Date.now() - 3600000).toLocaleString('pt-BR')
  });
});

export default router;
