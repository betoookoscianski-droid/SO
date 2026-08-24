/**
 * Gerador de Respostas Jurídicas
 * Responsável por:
 * 1. Gerar respostas padrão para cumprimento
 * 2. Elaborar pareceres jurídicos para instrução
 * 3. Formatar em PDF
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

class ResponseGenerator {
  constructor(config = {}) {
    this.pdfDir = config.PDF_DIR || './pdfs';
    this.assinante = config.ASSINANTE || 'Secretaria de Estado';
    this.timbreGoverno = config.TIMBRE_GOVERNO || 'Governo de Santa Catarina';
  }

  /**
   * Gera resposta padrão para CUMPRIMENTO
   */
  gerarRespostaCumprimento(dados) {
    const { servidor, oficio, calculos, processo } = dados;
    
    let texto = `RESPOSTA AO OFÍCIO ${oficio.numero}\n\n`;
    texto += `Ref: ${oficio.assunto}\n`;
    texto += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    texto += `Prezados Senhores,\n\n`;
    
    texto += `Em resposta ao Ofício ${oficio.numero} de ${new Date(oficio.data_recebimento).toLocaleDateString('pt-BR')}, `;
    texto += `informamos os seguintes dados do servidor:\n\n`;
    
    // Dados Pessoais
    texto += `DADOS PESSOAIS:\n`;
    texto += `Nome: ${servidor.nome}\n`;
    texto += `CPF: ${servidor.cpf}\n`;
    texto += `Data de Nascimento: ${servidor.data_nascimento || 'N/A'}\n\n`;
    
    // Dados Funcionais
    texto += `DADOS FUNCIONAIS:\n`;
    texto += `Matrícula: ${servidor.matricula}\n`;
    texto += `Cargo: ${servidor.cargo}\n`;
    texto += `Lotação: ${servidor.lotacao}\n`;
    texto += `Data de Admissão: ${servidor.data_admissao}\n`;
    texto += `Status: ${servidor.ativo ? 'ATIVO' : 'INATIVO'}\n\n`;
    
    // Cálculos
    if (calculos) {
      texto += `VENCIMENTOS (${calculos.mes}/${calculos.ano}):\n`;
      texto += `Salário Base: R$ ${this.formatarMoeda(calculos.salario_base)}\n`;
      
      if (calculos.gratificacoes && calculos.gratificacoes.length > 0) {
        texto += `Gratificações:\n`;
        calculos.gratificacoes.forEach(g => {
          texto += `  - ${g.tipo}: R$ ${this.formatarMoeda(g.valor)}\n`;
        });
      }
      
      if (calculos.descontos && calculos.descontos.length > 0) {
        texto += `Descontos:\n`;
        calculos.descontos.forEach(d => {
          texto += `  - ${d.tipo}: R$ ${this.formatarMoeda(d.valor)}\n`;
        });
      }
      
      texto += `Total Bruto: R$ ${this.formatarMoeda(calculos.total_bruto)}\n`;
      texto += `Total Líquido: R$ ${this.formatarMoeda(calculos.total_liquido)}\n\n`;
    }
    
    texto += `Atenciosamente,\n\n`;
    texto += `${this.assinante}\n`;
    texto += `Secretaria de Administração`;
    
    return texto;
  }

  /**
   * Gera parecer jurídico para INSTRUÇÃO
   */
  gerarParecerJuridico(dados) {
    const { servidor, oficio, calculos, historico, analise } = dados;
    
    let texto = `PARECER JURÍDICO\n\n`;
    texto += `Ofício: ${oficio.numero}\n`;
    texto += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    texto += `Assunto: ${oficio.assunto}\n\n`;
    
    texto += `I. DOS FATOS:\n\n`;
    texto += `Trata-se de questão suscitada no Ofício ${oficio.numero} relativa a:`;
    texto += `${oficio.assunto}.\n\n`;
    
    texto += `Dados do Servidor:\n`;
    texto += `${servidor.nome} - CPF: ${servidor.cpf}\n`;
    texto += `Matrícula: ${servidor.matricula} - Cargo: ${servidor.cargo}\n\n`;
    
    texto += `II. DOS FUNDAMENTOS:\n\n`;
    
    if (analise && analise.fundamentacao_legal) {
      texto += `A questão é regulada pela seguinte fundamentação legal:\n`;
      analise.fundamentacao_legal.forEach((lei, idx) => {
        texto += `${idx + 1}. ${lei}\n`;
      });
    }
    
    texto += `\nIII. DA ANÁLISE:\n\n`;
    
    if (calculos && historico) {
      texto += `Conforme análise dos registros em sistema SIGRH:\n`;
      texto += `- Última atualização de cálculos: ${calculos.data_calculo}\n`;
      texto += `- Vencimento Base: R$ ${this.formatarMoeda(calculos.salario_base)}\n`;
      
      if (historico && historico.length > 0) {
        texto += `- Histórico de eventos: ${historico.length} registros encontrados\n`;
      }
    }
    
    if (analise && analise.conclusao) {
      texto += `\nIV. CONCLUSÃO:\n\n`;
      texto += `${analise.conclusao}\n`;
    }
    
    if (analise && analise.recomendacoes) {
      texto += `\nV. RECOMENDAÇÕES:\n\n`;
      analise.recomendacoes.forEach((rec, idx) => {
        texto += `${idx + 1}. ${rec}\n`;
      });
    }
    
    texto += `\n\nAtenciosamente,\n\n`;
    texto += `${this.assinante}\n`;
    texto += `Procurador de Estado`;
    
    return texto;
  }

  /**
   * Gera PDF a partir de texto
   */
  async gerarPDF(conteudo, nomeArquivo) {
    return new Promise((resolve, reject) => {
      try {
        // Cria diretório se não existir
        if (!fs.existsSync(this.pdfDir)) {
          fs.mkdirSync(this.pdfDir, { recursive: true });
        }
        
        const caminhoArquivo = path.join(this.pdfDir, nomeArquivo);
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(caminhoArquivo);
        
        doc.pipe(stream);
        
        // Cabeçalho
        doc.fontSize(10).text(this.timbreGoverno, { align: 'center' });
        doc.moveDown(2);
        
        // Conteúdo
        doc.fontSize(11).text(conteudo);
        
        // Rodapé
        doc.moveDown(2);
        doc.fontSize(8).text(
          `Documento gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`,
          { align: 'center' }
        );
        
        doc.end();
        
        stream.on('finish', () => {
          resolve({
            sucesso: true,
            caminho: caminhoArquivo,
            nome: nomeArquivo
          });
        });
        
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Processa e gera resposta completa
   */
  async processarEGerar(dados, tipoOficio) {
    try {
      let conteudo;
      let nomePDF;
      
      if (tipoOficio === 'cumprimento') {
        conteudo = this.gerarRespostaCumprimento(dados);
        nomePDF = `resposta_${dados.oficio.numero}_${Date.now()}.pdf`;
      } else if (tipoOficio === 'instrucao') {
        conteudo = this.gerarParecerJuridico(dados);
        nomePDF = `parecer_${dados.oficio.numero}_${Date.now()}.pdf`;
      } else {
        throw new Error('Tipo de ofício não reconhecido');
      }
      
      const resultado = await this.gerarPDF(conteudo, nomePDF);
      
      return {
        sucesso: true,
        tipo: tipoOficio,
        pdf: resultado,
        conteudo: conteudo,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  /**
   * Utilitários
   */
  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}

export default ResponseGenerator;
