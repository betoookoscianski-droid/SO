/**
 * SIGRH Connector - Integração com sistema SIGRH
 * Responsável por:
 * 1. Autenticação no SIGRH
 * 2. Navegação nos menus
 * 3. Extração de dados dos processos
 * 4. Retorno de informações estruturadas
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

class SIGRHConnector {
  constructor(config) {
    this.baseURL = config.SIGRH_URL || 'https://sigrh.sea.sc.gov.br';
    this.loginPath = '/SIGRH/SEG/SEGAcessoUsuarioLogar.aspx';
    this.username = config.SIGRH_USERNAME;
    this.password = config.SIGRH_PASSWORD;
    this.cookies = null;
    this.session = null;
  }

  /**
   * Faz login no SIGRH
   */
  async login(username, password) {
    try {
      const loginURL = `${this.baseURL}${this.loginPath}`;
      
      // Primeira requisição para obter cookies/tokens CSRF
      const getResponse = await axios.get(loginURL, {
        withCredentials: true
      });
      
      // Extract CSRF token se necessário
      const $ = cheerio.load(getResponse.data);
      const csrfToken = $('input[name="__RequestVerificationToken"]').val();
      
      // Segunda requisição com credenciais
      const postResponse = await axios.post(
        loginURL,
        {
          __RequestVerificationToken: csrfToken,
          username: username,
          password: password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      this.cookies = postResponse.headers['set-cookie'];
      this.username = username;
      
      return {
        success: true,
        message: 'Login SIGRH realizado com sucesso',
        sessionId: postResponse.data.sessionId
      };
    } catch (error) {
      console.error('Erro no login SIGRH:', error);
      return {
        success: false,
        error: 'Falha ao autenticar no SIGRH',
        details: error.message
      };
    }
  }

  /**
   * Navega pelos menus do SIGRH
   */
  async navegarMenus() {
    try {
      const menusDisponíveis = [
        {
          id: 'processos',
          nome: 'Processos Administrativos',
          url: '/SIGRH/GRD/GRDProcessos.aspx'
        },
        {
          id: 'fichas',
          nome: 'Fichas Funcionais',
          url: '/SIGRH/FUN/FUNFichaFuncional.aspx'
        },
        {
          id: 'calculos',
          nome: 'Cálculos e Vencimentos',
          url: '/SIGRH/VEN/VENCálculos.aspx'
        },
        {
          id: 'documentos',
          nome: 'Documentos',
          url: '/SIGRH/DOC/DOCDocumentos.aspx'
        }
      ];
      
      return {
        success: true,
        menus: menusDisponíveis
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao listar menus'
      };
    }
  }

  /**
   * Abre um processo específico no SIGRH
   */
  async abrirProcesso(numeroProcesso) {
    try {
      const response = await axios.get(
        `${this.baseURL}/SIGRH/GRD/GRDProcessos.aspx`,
        {
          params: {
            numeroProcesso: numeroProcesso,
            action: 'view'
          },
          withCredentials: true,
          headers: {
            Cookie: this.cookies
          }
        }
      );
      
      const $ = cheerio.load(response.data);
      
      // Extrai informações do processo
      const processo = {
        numero: numeroProcesso,
        titulo: $('h1.titulo-processo').text().trim(),
        status: $('span.status-processo').text().trim(),
        data_abertura: $('span.data-processo').text().trim(),
        descricao: $('div.descricao-processo').text().trim()
      };
      
      return {
        success: true,
        processo: processo
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao abrir processo',
        details: error.message
      };
    }
  }

  /**
   * Extrai dados funcionais de um servidor
   */
  async extrairFichaFuncional(cpf) {
    try {
      const response = await axios.get(
        `${this.baseURL}/SIGRH/FUN/FUNFichaFuncional.aspx`,
        {
          params: { cpf: cpf },
          withCredentials: true,
          headers: {
            Cookie: this.cookies
          }
        }
      );
      
      const $ = cheerio.load(response.data);
      
      const ficha = {
        dados_pessoais: {
          nome: $('input[name="nome"]').val(),
          cpf: $('input[name="cpf"]').val(),
          data_nascimento: $('input[name="dataNascimento"]').val(),
          sexo: $('select[name="sexo"]').val()
        },
        dados_funcionais: {
          matricula: $('input[name="matricula"]').val(),
          cargo: $('input[name="cargo"]').val(),
          lotacao: $('input[name="lotacao"]').val(),
          data_admissao: $('input[name="dataAdmissao"]').val(),
          status: $('select[name="status"]').val()
        },
        documentos: this.extrairDocumentos($)
      };
      
      return {
        success: true,
        ficha: ficha
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao extrair ficha funcional',
        details: error.message
      };
    }
  }

  /**
   * Extrai cálculos de vencimentos
   */
  async extrairCalculos(cpf, mes = null, ano = null) {
    try {
      const response = await axios.get(
        `${this.baseURL}/SIGRH/VEN/VENCálculos.aspx`,
        {
          params: {
            cpf: cpf,
            mes: mes || new Date().getMonth() + 1,
            ano: ano || new Date().getFullYear()
          },
          withCredentials: true,
          headers: {
            Cookie: this.cookies
          }
        }
      );
      
      const $ = cheerio.load(response.data);
      
      const calculos = {
        mes: $('input[name="mes"]').val(),
        ano: $('input[name="ano"]').val(),
        salario_base: parseFloat($('span.salario-base').text().replace(/[^0-9,]/g, '').replace(',', '.')),
        gratificacoes: [],
        descontos: [],
        total_bruto: 0,
        total_liquido: 0,
        data_calculo: new Date().toISOString()
      };
      
      // Extrai gratificações
      $('table.gratificacoes tr').each((i, elem) => {
        calculos.gratificacoes.push({
          tipo: $(elem).find('td:nth-child(1)').text().trim(),
          valor: parseFloat($(elem).find('td:nth-child(2)').text().replace(/[^0-9,]/g, '').replace(',', '.'))
        });
      });
      
      // Extrai descontos
      $('table.descontos tr').each((i, elem) => {
        calculos.descontos.push({
          tipo: $(elem).find('td:nth-child(1)').text().trim(),
          valor: parseFloat($(elem).find('td:nth-child(2)').text().replace(/[^0-9,]/g, '').replace(',', '.'))
        });
      });
      
      return {
        success: true,
        calculos: calculos
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao extrair cálculos',
        details: error.message
      };
    }
  }

  /**
   * Extrai histórico do servidor/processo
   */
  async extrairHistorico(cpf) {
    try {
      const response = await axios.get(
        `${this.baseURL}/SIGRH/GRD/GRDHistorico.aspx`,
        {
          params: { cpf: cpf },
          withCredentials: true,
          headers: {
            Cookie: this.cookies
          }
        }
      );
      
      const $ = cheerio.load(response.data);
      
      const historico = [];
      $('table.historico tr').each((i, elem) => {
        if (i > 0) { // pula header
          historico.push({
            data: $(elem).find('td:nth-child(1)').text().trim(),
            evento: $(elem).find('td:nth-child(2)').text().trim(),
            responsavel: $(elem).find('td:nth-child(3)').text().trim(),
            observacoes: $(elem).find('td:nth-child(4)').text().trim()
          });
        }
      });
      
      return {
        success: true,
        historico: historico
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao extrair histórico',
        details: error.message
      };
    }
  }

  /**
   * Extrai documentos anexados
   */
  extrairDocumentos($) {
    const documentos = [];
    $('a.documento').each((i, elem) => {
      documentos.push({
        nome: $(elem).text().trim(),
        url: $(elem).attr('href'),
        tipo: $(elem).data('tipo'),
        data: $(elem).data('data')
      });
    });
    return documentos;
  }

  /**
   * Método consolidado: extrai TUDO de um processo
   */
  async extrairProcessoCompleto(cpf, numeroProcesso) {
    try {
      const [ficha, calculos, historico, processo] = await Promise.all([
        this.extrairFichaFuncional(cpf),
        this.extrairCalculos(cpf),
        this.extrairHistorico(cpf),
        this.abrirProcesso(numeroProcesso)
      ]);
      
      return {
        success: true,
        dados_consolidados: {
          ficha: ficha.ficha,
          calculos: calculos.calculos,
          historico: historico.historico,
          processo: processo.processo,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao extrair dados completos',
        details: error.message
      };
    }
  }
}

export default SIGRHConnector;
