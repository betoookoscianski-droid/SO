/**
 * Intérprete de Ofícios - Analisa ofícios do PGENet
 * Responsável por:
 * 1. Interpretar tipo de ofício (cumprimento vs instrução)
 * 2. Identificar dados necessários
 * 3. Validar contra SIGRH
 */

class OficioInterpreter {
  constructor() {
    this.tiposOficio = {
      CUMPRIMENTO: 'cumprimento',
      INSTRUCAO: 'instrucao'
    };
    
    this.palavrasChavesCumprimento = [
      'informar',
      'confirmar',
      'fornecer',
      'dados',
      'nome',
      'matrícula',
      'cargo',
      'salário',
      'vencimentos'
    ];
    
    this.palavrasChavesInstrucao = [
      'questionar',
      'verificar',
      'analisar',
      'investigar',
      'examinar',
      'incorreto',
      'indevido',
      'ilegal',
      'parecer',
      'justificar'
    ];
  }

  /**
   * Identifica tipo de ofício analisando conteúdo
   */
  identificarTipo(conteudoOficio) {
    const conteudoLower = conteudoOficio.toLowerCase();
    
    let pontuacaoCumprimento = 0;
    let pontuacaoInstrucao = 0;
    
    // Verifica palavras-chave de cumprimento
    this.palavrasChavesCumprimento.forEach(palavra => {
      if (conteudoLower.includes(palavra)) {
        pontuacaoCumprimento += 1;
      }
    });
    
    // Verifica palavras-chave de instrução
    this.palavrasChavesInstrucao.forEach(palavra => {
      if (conteudoLower.includes(palavra)) {
        pontuacaoInstrucao += 1;
      }
    });
    
    if (pontuacaoCumprimento > pontuacaoInstrucao) {
      return {
        tipo: this.tiposOficio.CUMPRIMENTO,
        confianca: pontuacaoCumprimento,
        descricao: 'Ofício de cumprimento (resposta simples com dados)'
      };
    } else if (pontuacaoInstrucao > pontuacaoCumprimento) {
      return {
        tipo: this.tiposOficio.INSTRUCAO,
        confianca: pontuacaoInstrucao,
        descricao: 'Ofício de instrução (requer análise jurídica)'
      };
    } else {
      return {
        tipo: 'indefinido',
        confianca: 0,
        descricao: 'Tipo de ofício não definido - requer análise manual'
      };
    }
  }

  /**
   * Extrai campos necessários do ofício
   */
  extrairCamposNecessarios(conteudoOficio, tipoOficio) {
    const campos = {
      dados_pessoais: [],
      dados_funcionais: [],
      calculos: [],
      documentos: [],
      analise_juridica: false
    };
    
    const conteudoLower = conteudoOficio.toLowerCase();
    
    // Detecta CPF
    if (/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(conteudoOficio)) {
      campos.dados_pessoais.push('cpf');
    }
    
    // Detecta outros campos
    if (conteudoLower.includes('nome')) campos.dados_pessoais.push('nome');
    if (conteudoLower.includes('data nascimento')) campos.dados_pessoais.push('data_nascimento');
    if (conteudoLower.includes('matrícula')) campos.dados_funcionais.push('matricula');
    if (conteudoLower.includes('cargo')) campos.dados_funcionais.push('cargo');
    if (conteudoLower.includes('lotação')) campos.dados_funcionais.push('lotacao');
    if (conteudoLower.includes('salário') || conteudoLower.includes('vencimento')) {
      campos.calculos.push('salario_base');
      campos.calculos.push('descontos');
      campos.calculos.push('total_liquido');
    }
    if (conteudoLower.includes('gratificação')) campos.calculos.push('gratificacoes');
    if (conteudoLower.includes('histórico')) campos.documentos.push('historico');
    if (conteudoLower.includes('documento') || conteudoLower.includes('anexo')) campos.documentos.push('anexos');
    
    // Identifica se precisa análise jurídica
    if (tipoOficio === 'instrucao') {
      campos.analise_juridica = true;
    }
    
    return campos;
  }

  /**
   * Valida dados extraídos contra padrões
   */
  validarDados(dados, camposNecessarios) {
    const validacao = {
      valido: true,
      erros: [],
      avisos: []
    };
    
    // Valida CPF se presente
    if (camposNecessarios.dados_pessoais.includes('cpf')) {
      if (!dados.cpf || !/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(dados.cpf)) {
        validacao.erros.push('CPF inválido ou não fornecido');
        validacao.valido = false;
      }
    }
    
    // Valida cálculos se presentes
    if (camposNecessarios.calculos.length > 0) {
      if (!dados.calculos || typeof dados.calculos !== 'object') {
        validacao.avisos.push('Cálculos não disponíveis - será necessário validação manual');
      }
    }
    
    return validacao;
  }

  /**
   * Processa um ofício completo
   */
  processar(oficio) {
    const tipoIdentificado = this.identificarTipo(oficio.conteudo);
    const camposNecessarios = this.extrairCamposNecessarios(
      oficio.conteudo,
      tipoIdentificado.tipo
    );
    
    return {
      oficio_id: oficio.id,
      numero_oficio: oficio.numero,
      tipo_identificado: tipoIdentificado.tipo,
      confianca_tipo: tipoIdentificado.confianca,
      descricao: tipoIdentificado.descricao,
      campos_necessarios: camposNecessarios,
      prazo_resposta: oficio.prazo_resposta || 10,
      data_processamento: new Date().toISOString()
    };
  }
}

export default OficioInterpreter;
