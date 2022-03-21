import { cidade } from './../model/PainelIndicadorCidades/cidade';
import swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PcsUtil {

  constructor() { }

  public static swal() {
    return swal.mixin({
      confirmButtonClass: 'mat-flat-button mat-primary',
      cancelButtonClass: 'mat-flat-button mat-warn',
      buttonsStyling: false
    });
  }

  public static removerAcento(provinciaEstadoTexto: string): string {
    provinciaEstadoTexto = provinciaEstadoTexto.toLowerCase();
    provinciaEstadoTexto = provinciaEstadoTexto.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    provinciaEstadoTexto = provinciaEstadoTexto.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    provinciaEstadoTexto = provinciaEstadoTexto.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    provinciaEstadoTexto = provinciaEstadoTexto.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    provinciaEstadoTexto = provinciaEstadoTexto.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    provinciaEstadoTexto = provinciaEstadoTexto.replace(new RegExp('[Ç]', 'gi'), 'c');
    return provinciaEstadoTexto;
  }

  public static blockCaracteresEspeciais(eventKeyCode: any): boolean {
    if (eventKeyCode >= 48 && eventKeyCode <= 57) {
      return true;
    }
    else if (eventKeyCode >= 64 && (eventKeyCode !== 91 && eventKeyCode !== 92 && eventKeyCode !== 93 && eventKeyCode !== 94 && eventKeyCode !== 95 && eventKeyCode !== 96 &&
      eventKeyCode !== 123 && eventKeyCode !== 124 && eventKeyCode !== 125 && eventKeyCode !== 126 && eventKeyCode !== 167 && eventKeyCode !== 168 && eventKeyCode !== 176 &&
      eventKeyCode !== 180 && eventKeyCode !== 186)) {
      return true;
         }
    else if (eventKeyCode === 32) {
      return true;
         }
    else {
      return false;
         }
  }

  public static buildDataToReport(tituloRelatorio: string, registros: Array<any>): Array<any> {
    const registrosToExcel: Array<any> = new Array<any>();
    switch (tituloRelatorio) {
      case 'Relatórios Gerados':
        for (const item of registros) {
          registrosToExcel.push({ 'Data': item.data, 'Hora': item.hora, Usuário: item.nomeUsuario, Arquivo: item.nomeRelatorio });
        }
        break;
      case 'Atividade do Usuário':
        for (const item of registros) {
          registrosToExcel.push({ Usuário: item.nomeUsuario, 'Data': item.data, 'Hora': item.hora, Ação: item.acao, Módulo: item.modulo });
        }
        break;
      case 'Downloads e Exportações':
        for (const item of registros) {
          registrosToExcel.push({ 'Cidade': item.cidade, 'Email': item.email, 'Nome': item.nome, 'Organização': item.organizacao, 'Boletim': item.boletim, 'Arquivo': item.arquivo, 'Data Download': item.dataDownload, 'Ação': item.acao, 'Página': item.pagina });
        }
        break;
      case 'Ações Gestores Municipais':
        for (const item of registros) {
          registrosToExcel.push({ 'Data': item.data, 'Hora': item.hora, 'Usuário de Prefeitura': item.usuario, Cidade: item.cidade, Ação: item.acao });
        }
        break;
      case 'Eventos':
        for (const item of registros) {
          registrosToExcel.push({ Data: item.data, Título: item.titulo, 'N° Pessoas Adicionaram': item.npessoasAdicionaram, 'N° Pessoas Cadastradas': item.npessoasCadastradas, 'N° Pessoas Seguiram': item.npessoasSeguiram, 'N° Pessoas Visualizaram': item.npessoasVisualizaram });
        }
        break;
      case 'Indicadores Preenchidos':
        for (const item of registros) {
          registrosToExcel.push({ Prefeitura: item.prefeitura, Estado: item.estado, 'Código IBGE': item.codigoIBGE, Indicador: item.indicador, Eixo: item.eixo, ODS: item.ods, 'Ano de Referência': item.anoIndicador,'Data Preenchimento': item.dataPreenchimento, 'Hora Preenchimento': item.horaPreenchimento });
        }
        break;
      case 'Interação com as ferramentas CHAT e Fórum':
        for (const item of registros) {
          registrosToExcel.push({ 'Data': item.data, Usuário: item.nomeDoUsuario, Ferramenta: item.ferramenta });
        }
        break;
      case 'Interação com ferramentas':
        for (const item of registros) {
          registrosToExcel.push({ Usuário: item.nomeUsuario, 'Data/Hora': item.dataHora, Ferramenta: item.ferramenta, 'Tipo de Interação': item.tipoInteracao });
        }
        break;
      case 'Quantidade de Indicadores Cadastrados':
        for (const item of registros) {
          registrosToExcel.push({ Prefeitura: item.prefeitura, Estado: item.estado, 'Código IBGE': item.codigoIBGE, Ano: item.ano, Quantidade: item.quantidade });
        }
        break;
      case 'Quantidade de Indicadores Preenchidos':
        for (const item of registros) {
          registrosToExcel.push({ Prefeitura: item.prefeitura, Estado: item.estado, 'Código IBGE': item.codigoIBGE, Ano: item.ano, Quantidade: item.quantidade, População: item.populacao });
        }
        break;
      case 'Visualização Cartográfica':
        for (const item of registros) {
          registrosToExcel.push({ 'Indicador': item.indicador, 'Quantidade de Visualizações': item.qtdVisualizacao, 'Quantidade de Exportações': item.qtdeExportacao,'Cidade': item.cidade, 'Estado': item.estado, 'Usuário': item.usuario, 'Data': item.data, 'Data/Hora': item.dataHora, 'Ação': item.acao });
        }
        break;
      case 'Relatório de Plano de Metas':
        for (const item of registros) {
          registrosToExcel.push({ Usuário: item.nomeUsuario, 'Data/Hora': item.dataHora, 'Cidade': item.cidade, 'Estado': item.estado, 'Início do Mandato': item.inicioMandato, 'Fim do Mandato': item.fimMandato,'Código IBGE': item.codigoIBGE });
        }
        break;
      case 'Sessões de Usuário':
        for (const item of registros) {
          registrosToExcel.push({ Usuário: item.nomeUsuario, 'Prefeitura': item.prefeitura,'Data Início': item.dataInicioSessao, 'Data Fim': item.dataFimSessao, 'Hora Início': item.horaInicioSessao, 'Hora Fim': item.horaFimSessao, Duração: item.duracao });
        }
        break;
      case 'Conteúdos Compartilhados':
        for (const item of registros) {
          registrosToExcel.push({ 'Data/Hora': item.data, Usuário: item.nomeUsuario, 'Rede Social': item.redeSocial, 'Conteúdo Compartilhado': item.conteudoCompartilhado });
        }
        break;
      case 'Cidades Inscritas Premiação':
        for (const item of registros) {
          registrosToExcel.push({ Cidade: item.cidade });
        }
        break;
      case 'Histórico de Operação':
        for (const item of registros) {
          registrosToExcel.push({ Data: item.data, Usuário: item.usuario, 'Tipo de Ação': item.tipoacao, Módulo: item.modulo});
        }
        break;
      case 'Relatório de Shapes Cadastrados pelo PCS':
        for (const item of registros) {
          registrosToExcel.push({ 'Título do shape': item.tituloShape, 'Nome do usuário': item.usuario, 'Data Cadastro': item.dataCriacao, 'Data Edição': item.dataEdicao} );
        }
        break;
      case 'Relatório de Shapes Cadastrados pela Prefeitura':
        for (const item of registros) {
          registrosToExcel.push({ 'Nome do usuário': item.usuario, 'Título do shape': item.tituloShape,  'Data Cadastro': item.dataCriacao, 'Data Edição': item.dataEdicao, Cidade: item.cidade} );
        }
        break;
      case 'Relatório de Shapes Exportados':
        for (const item of registros) {
          registrosToExcel.push({ 'Nome do usuário': item.usuario, Cidade: item.cidade, 'Título do shape': item.tituloShape,  'Data Exportação': item.dataExportacao , 'Hora Exportação': item.horaExportacao } );
        }
        break;
      case 'Relatório Plano de Metas e Prestação de Contas':
        for (const item of registros) {
          registrosToExcel.push({ 'Plano de Metas': item.planoDeMetas, 'Prestação de Contas': item.prestacaoDeContas, 'Data Upload Plano de Metas': item.dataUploadPlano, 'Hora Upload Plano de Metas': item.horaUploadPlano, 'Data Upload Prestação de Contas': item.dataUploadPrestacao, 'Hora Upload Prestação de Contas': item.horaUploadPrestacao, 'Província/Estado': item.estado, Cidade: item.cidade, 'Período do Mandato': item.mandato, 'Usuário': item.nomeUsuario } );
        }
        break;
      case 'Relatório de Eventos':
        for (const item of registros) {
          registrosToExcel.push({ Título: item.titulo, Tipo: item.tipo, 'Data evento': item.dataEvento, Endereco: item.endereco, País: item.pais, Estado: item.estado, Cidade: item.cidade, Descricao: item.descricao, Organizador: item.organizador, Temas: item.temas, Eixos: item.eixos, Ods: item.tituloOds, Online: item.online, Site: item.site, Latitude: item.latitude, Longitude: item.longitude, Publicado: item.publicado, Externo: item.externo, 'Link externo': item.linkExterno} );
        }
        break;
      case 'Formulario':
        for (const item of registros) {
          item.respostas.forEach(element => {
            registrosToExcel.push({ 'Usuario Nome': item.usuarioNome, 'Logado': item.logado, 'Date e Hora': item.dataHora, 'Seção': element.secao, 'Pergunta': element.pergunta, 'Resposta': element.resposta });
          });

        }
        break;
      case 'Extrair Conteúdo das Boas Práticas do PCS':
        for (const item of registros) {
          registrosToExcel.push({ 'Nome instituição': item.nomeInstituicao, 'Título': item.titulo, 'Estado': item.proviciaEstado, 'Cidade': item.cidade, 'Endereço': item.endereco, 'Site': item.site, 'Nome responsável': item.nomeResponsavel, 'Contato': item.contato, 'E-mail': item.email, 'Telefone': item.telefone, 'Celular': item.celular, 'Objetivo geral': item.objetivoGeral, 'Objetivo específico': item.objetivoEspecifico, 'Principais resultados': item.principaisResultados, 'Aprendizado fundamental': item.aprendizadoFundamental, 'Parceiros envolvidos': item.parceirosEnvolvidos, 'Resultados quantitativos': item.resultadosQuantitativos, 'Resultados qualitativos': item.resultadosQualitativos, 'Parâmetros contemplados': item.parametrosContemplados, 'Público atingido': item.publicoAtingido, 'Eixos': item.eixo, 'Informações complementares': item.informacoesComplementares, 'Prefeitura': item.prefeitura, 'Subtítulo': item.subtitulo, 'Galeria de vídeos': item.galeriaDeVideos, 'Fonte referência': item.fontesReferencia, 'Indicadores': item.indicadores, 'Metas ODS': item.metasOds, 'ODS': item.ods, 'Data Início': item.dtInicio, 'Tipo': item.tipo, 'Página Inicial': item.paginaInicial, 'Data publicação': item.dataPublicacao, 'Possui filtro': item.possuiFiltro, 'Autor imagem principal': item.autorImagemPrincipal });
          }
        break;
      case 'Extrair Conteúdo das Boas Práticas de Prefeituras Signatárias':
        for (const item of registros) {
          registrosToExcel.push({ 'Nome instituição': item.nomeInstituicao, 'Título': item.titulo, 'Estado': item.proviciaEstado, 'Cidade': item.cidade, 'Endereço': item.endereco, 'Site': item.site, 'Nome responsável': item.nomeResponsavel, 'Contato': item.contato, 'E-mail': item.email, 'Telefone': item.telefone, 'Celular': item.celular, 'Objetivo geral': item.objetivoGeral, 'Objetivo específico': item.objetivoEspecifico, 'Principais resultados': item.principaisResultados, 'Aprendizado fundamental': item.aprendizadoFundamental, 'Parceiros envolvidos': item.parceirosEnvolvidos, 'Resultados quantitativos': item.resultadosQuantitativos, 'Resultados qualitativos': item.resultadosQualitativos, 'Parâmetros contemplados': item.parametrosContemplados, 'Público atingido': item.publicoAtingido, 'Eixos': item.eixo, 'Informações complementares': item.informacoesComplementares, 'Prefeitura': item.prefeitura, 'Subtítulo': item.subtitulo, 'Galeria de vídeos': item.galeriaDeVideos, 'Fonte referência': item.fontesReferencia, 'Indicadores': item.indicadores, 'Metas ODS': item.metasOds, 'ODS': item.ods, 'Data Início': item.dtInicio, 'Tipo': item.tipo, 'Página Inicial': item.paginaInicial, 'Data publicação': item.dataPublicacao, 'Possui filtro': item.possuiFiltro, 'Autor imagem principal': item.autorImagemPrincipal });
          }
        break;
      case 'Relatório de contagem de boas práticas do PCS':
        for (const item of registros) {
          registrosToExcel.push({ 'Nome': item.nome,  'Contagem': item.contagem });
          }
        break;
      case 'Relatório de contagem de boas práticas das cidades signatárias':
        for (const item of registros) {
          registrosToExcel.push({ 'Nome': item.nome,  'Contagem': item.contagem });
          }
        break;
      case 'Relatórios Dados Download':
      for (const item of registros) {
        registrosToExcel.push({ 'Cidade': item.cidade, 'Email': item.email, 'Nome': item.nome, 'Organização': item.organizacao, 'Boletim': item.boletim, 'Arquivo': item.arquivo, 'Data Download': item.dataDownload, 'Usuário': item.usuario, 'Ação': item.acao, 'Página': item.pagina });
        }
      break;
      case 'calendario-de-eventos-pcs':
        for (const item of registros) {
          registrosToExcel.push({'Evento': item.evento, 'Descrição': item.descricao, 'Data': item.data, 'Horário': item.horario, "Tipo do Evento": item.tipo, "Endereço": item.endereco  });
          }
        break;
      case 'Registro de Usuarios':
        for(const item of registros) {
          registrosToExcel.push({'Usuário': item.usuario, 'Perfil': item.perfil, 'E-mail': item.email, 'Telefone': item.telefone, 'Município': item.municipio, 'Instituição': item.instituicao});
        }
      break;
      case 'Indicadores Completo':
        for(const item of registros) {
          registrosToExcel.push({'Código IBGE': item.codigoIBGE, 'Cidade': item.cidade, 'Estado': item.estado, 'Prefeito': item.prefeito, 'População': item.populacao, 'Porte': item.porte, 'Usuários cadastrados': item.usuarioCadastrado, 'Qtd. Usuários Cadastrados': item.qtdUsuarioCadastrado, 'Indicadores Mínimos': item.indicadoresMinimos, 'Qtd. Indicadores Preenchidos': item.qtdIndicadoresPreenchidos, '% Indicadores Preenchidos': item.porcentagemIndicadoresPreenchidos})
        }
      break;
      case 'Relatório de API Pública':
        for(const item of registros) {
          registrosToExcel.push({'Endpoint': item.endpoint, 'Data': item.data, 'Hora': item.hora, 'Origem Requisição': item.origemRequisicao})
        }
    }
    return registrosToExcel;
  }
  static mask(val: string, mask: string) {
    let maskared = '';
    let k = 0;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '#') {
        if (val[k] != null) {
          maskared = maskared + val[k++];
        }
      } else {
        if (mask[i] != null) {
          maskared = maskared + mask[i];
        }
      }
    }
    return maskared;

  }

  static tamanhoArquivoEstaDentroDoLimite(arquivo) {
    const pad = arquivo.slice(-2);
    const padlen = (pad === '==') ? 2 : ((pad.slice(-1) === '=') ? 1 : null);
    if ((arquivo.length / 4) * 3 - padlen > 10000000) {
      return false;
    } else {
      return true;
    }
  }

  public replaceHtmlTags(a: string) {
    return a && a.replace(/(<([^>]+)>)/ig, '');
  }

  public subStringSemCortarTexto(texto: string, limite: number) {
    let textoAux: string;
    if (texto !== null) {
      if ( texto.length >= limite ) {
          textoAux = texto.substring(0, texto.substring(0, limite).lastIndexOf(' '));
          return textoAux;
      } else {
        return texto;
      }
    }
  }

  public arredondaDuasCasasDecimais(numero: any) {
    return parseFloat(numero.replace(',', '.')).toFixed(3).replace('.', ',');
    // converte para string para fazer replace do ponto para virgula (padrao brasileiro)
  }

  public gerarClassesSerieNumerica(values: number[]) {
    const classes = [];
    if (values.length > 0) {
      const minValue = this.buscarValorMinimoSerieNumerica(values);
      const maxValue  = this.buscarValorMaximoSerieNumerica(values);

      classes[0] = minValue;
      classes[1] = maxValue;
    }

    return classes;
  }

  public gerarClassesNumerica(values: number[], nClasses: number, valueMin: number, valueMax: number) {
    const classes = [];
    if (values.length > 0) {
      const qtdAmostras = values.length;
      const min = valueMin ? valueMin : this.buscarValorMinimoSerieNumerica(values);
      const max = valueMax ? valueMax : this.buscarValorMaximoSerieNumerica(values);
      const amplitude = max - min;
      const qtdClasses = nClasses ? nClasses : Math.round(1 + (3.3 * Math.log10(qtdAmostras)));
      const intervalo = Math.ceil( amplitude / qtdClasses);

      let ultimoValor = min;
      while (ultimoValor < max) {
        classes.push({
          descricao: `De ${ultimoValor.toLocaleString('pt-BR')} até ${(ultimoValor + intervalo).toLocaleString('pt-BR')}`,
          minimo: ultimoValor,
          maximo: ultimoValor + intervalo
        });
        ultimoValor += intervalo;
      }
      if (amplitude == 0 ) {
        classes.push({
          descricao: `${ultimoValor.toLocaleString('pt-BR')}`,
          minimo: ultimoValor,
          maximo: ultimoValor
        });
      }
      if (values.includes(undefined)) {
        classes.push({
          descricao: 'vazio',
          minimo: undefined
        })
      }
      return classes;
      
    }

    return classes;
  }

  public buscarValorMinimoSerieNumerica(values: number[]) {
    let valuesSemUndefined = values.filter(value => value != undefined)
    return valuesSemUndefined.reduce((a, b) => {
      return Math.min(a, b);
    });
  }

  public buscarValorMaximoSerieNumerica(values: number[]) {
    let valuesSemUndefined = values.filter(value => value != undefined)
    return valuesSemUndefined.reduce((a, b) => {
      return Math.max(a, b);
    });
  }

  public calcularMediana(arr) {
    const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  }

  public calcularDesvioPadrao(arr) {
    const m = this.calcularMediana(arr);
    return Math.sqrt(arr.reduce(function(sq, n) {
      return sq + Math.pow(n - m, 2);
    }, 0) / (arr.length - 1));
  }

  public mode(arr) {
    let modes = [], count = [], i, number, maxIndex = 0;

    for (i = 0; i < arr.length; i += 1) {
        number = arr[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count) {
      if (count.hasOwnProperty(i)) {
        if (count[i] === maxIndex) {
            modes.push(Number(i));
        }
      }
    }

    return modes;
  }

  public static toSlug(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text

}

}
