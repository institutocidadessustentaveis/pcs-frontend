import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {path: 'grid', component: GridExampleComponent},S
  // Institucional
  {path: '', redirectTo: 'inicial/home', pathMatch: 'full', data: {pagina: 'home'}},
  {path: 'inicial/:pagina', loadChildren: '../app/views/modulo_administracao/home/home.module#HomeModule', data: {pagina: 'home'} },
  {path: 'institucional-interno', loadChildren: '../app/views/modulo_institucional/institucional-interno/institucional-interno.module#InstitucionalInternoModule', data: {title: 'Institucional » Institucional'}},
  {path: 'cidades_signatarias', loadChildren: '../app/views/modulo_institucional/cidades-signatarias/cidades-signatarias.module#CidadesSignatariasModule', data: {title: 'Institucional » Cidades Signatárias'} },
  {path: 'institucional/pagina/cidades-signatarias', loadChildren: '../app/views/modulo_institucional/cidades-signatarias/cidades-signatarias.module#CidadesSignatariasModule', data: {title: 'Institucional » Cidades Signatárias'} },
  {path: 'institucional/cidades-signatarias', loadChildren: '../app/views/modulo_institucional/cidades-signatarias/cidades-signatarias.module#CidadesSignatariasModule', data: {title: 'Institucional » Cidades Signatárias'} },
  {path: 'institucional/pagina/eixos-do-pcs', loadChildren: '../app/views/modulo_institucional/eixos-pcs/eixos-pcs.module#EixosPcsModule', data: {title: 'Institucional » Eixos do PCS'} },
  {path: 'institucional/eixos-do-pcs', loadChildren: '../app/views/modulo_institucional/eixos-pcs/eixos-pcs.module#EixosPcsModule', data: {title: 'Institucional » Eixos do PCS'} },
  {path: 'dados-abertos', loadChildren: '../app/views/dados-abertos/dados-abertos.module#DadosAbertosModule'},
  {path: 'material_institucional', loadChildren: '../app/views/modulo_institucional/material-institucional/material-institucional.module#MaterialInstitucionalModule', data: {title: 'Institucional » Material Institucional'} },
  {path: 'pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'pagina/:pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'pagina/:pagina/:pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'pagina/:pagina/:pagina/:pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'pagina/:pagina/:pagina/:pagina/:pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'pagina/:pagina/:pagina/:pagina/:pagina/:pagina/:pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'pagina/:pagina/:pagina/:pagina/:pagina/:pagina/:pagina/:pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},

  {path: 'institucional', loadChildren: '../app/views/modulo_institucional/institucional.module#InstitucionalModule', data: {title: 'Institucional'} },
  {path: 'institucional/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  {path: 'institucional/pagina/:pagina', loadChildren: '../app/views/modulo_institucional/pagina-institucional-detalhe/pagina-institucional-detalhe.module#PaginaInstitucionalDetalheModule'},
  
  

  // Administração
  //{path: 'lista-dados-download', loadChildren: '../app/views/modulo_administracao/lista-dados-download/lista-dados-download.module#ListaDadosDownloadModule', data: {title: 'Lista de Dados Download'} },
  {path: 'relatorio', loadChildren: '../app/views/relatorio/relatorio.module#RelatorioModule', data: {title: 'Administração de Usuário » Relatórios'} },
  {path: 'login', loadChildren: '../app/views/modulo_administracao/login/login.module#LoginModule'},
  {path: 'add-responsavel', loadChildren: '../app/views/modulo_administracao/add-responsavel/add-responsavel.module#AddResponsavelModule'},
  {path: 'cadastroCidadao', loadChildren: '../app/views/modulo_administracao/cadastro-cidadao/cadastro-cidadao.module#CadastroCidadaoModule'},
  {path: 'cadastrar-carta-compromisso', loadChildren: '../app/views/modulo_administracao/prefeitura/prefeitura.module#PrefeituraModule'},
  {path: 'alterarSenha', loadChildren: '../app/views/modulo_administracao/alterar-senha/alterar-senha.module#AlterarSenhaModule'},
  {path: 'usuarios', loadChildren: '../app/views/modulo_administracao/usuarios/usuarios.module#UsuariosModule', data: {title: 'Administração de Usuário » Cadastro de Usuários'} },
  {path: 'perfis', loadChildren: '../app/views/modulo_administracao/perfis/perfis.module#PerfisModule', data: {title: 'Administração de Usuário » Cadastro de Perfis'} },
  {path: 'pais', loadChildren: '../app/views/modulo_administracao/pais/pais.module#PaisModule', data: {title: 'Cadastro Territorial » Cadastro de Países'} },
  {path: 'ods', loadChildren: '../app/views/modulo_administracao/objetivo-desenvolvimento-sustentavel/objetivo-desenvolvimento-sustentavel.module#ODSModule', data: {title: 'Indicadores » Cadastro de ODS'} },
  {path: 'cadsenha', loadChildren: '../app/views/modulo_administracao/cad-senha-prefeitura/cad-senha-prefeitura.module#CadSenhaPrefeituraModule'},
  {path: 'estado-provincia', loadChildren: '../app/views/modulo_administracao/provincia-estado/provincia-estado.module#ProvinciaEstadoModule', data: {title: 'Cadastro Territorial » Cadastro de Estados/Províncias'} },
  {path: 'aprovacao-prefeitura', loadChildren: '../app/views/modulo_administracao/aprovacao-prefeitura/aprovacao-prefeitura.module#AprovacaoPrefeituraModule', data: {title: 'Cadastro de Prefeitura » Aprovação de Prefeitura'} },
  {path: 'recuperasenha', loadChildren: '../app/views/modulo_administracao/recupera-senha/recupera-senha.module#RecuperaSenhaModule'},
  {path: 'cidade', loadChildren: '../app/views/modulo_administracao/cidade/cidade.module#CidadeModule', data: {title: 'Cadastro Territorial » Cadastro de Cidades'} },
  {path: 'eixo', loadChildren: '../app/views/modulo_administracao/eixo/eixo.module#EixoModule', data: {title: 'Indicadores » Cadastro de Eixo'} },
  {path: 'alerta', loadChildren: '../app/views/modulo_administracao/alerta/alerta.module#AlertaModule'},
  {path: 'meusdados/:id', loadChildren: '../app/views/modulo_administracao/meus-dados/meus-dados.module#MeusDadosModule'},
  {path: 'usuario-prefeitura', loadChildren: '../app/views/modulo_administracao/usuario-prefeitura/usuario-prefeitura.module#UsuarioPrefeituraModule'},
  // tslint:disable-next-line: max-line-length
  {path: 'premiacaoAdmin', loadChildren: '../app/views/modulo_administracao/premiacao-admin/premiacao-admin.module#PremiacaoAdminModule', data: {title: 'Administração de Usuário » Administrar Premiações'} },
  {path: 'premiacaoPrefeitura', loadChildren: '../app/views/modulo_administracao/premiacao-prefeitura/premiacao-prefeitura.module#PremiacaoPrefeituraModule'},
  {path: 'dados_cidade', loadChildren: '../app/views/modulo_administracao/editar-dados-cidade/editar-dados-cidade.module#EditarDadosCidadeModule'},
  {path: 'historicoOperacao', loadChildren: '../app/views/modulo_administracao/historico-operacao/historico-operacao.module#HistoricoOperacaoModule', data: {title: 'Administração de Usuário » Histórico de Operação'} },
  {path: 'prefeitura', loadChildren: '../app/views/modulo_administracao/prefeitura-admin/prefeitura-admin.module#PrefeituraAdminModule', data: {title: 'Cadastro de Prefeitura » Administrar Prefeitura'} },
  {path: 'rodape', loadChildren: '../app/views/modulo_administracao/rodape/rodape.module#RodapeModule', data: {title: 'Rodapé'} },
  {path: 'menu', loadChildren: '../app/views/modulo_administracao/menu/menu.module#MenuModule', data: {title: 'Menu'} },
  {path: 'seo', loadChildren: '../app/views/modulo_administracao/seo/seo.module#SeoModule', data: {title: 'Seo'} },
  {path: 'importacao-prefeitura', loadChildren: '../app/views/modulo_administracao/importacao-prefeitura/importacao-prefeitura.module#ImportacaoPrefeituraModule', data: {title: 'Importação de Prefeituras'} },
  {path: 'ajustes-gerais', loadChildren: '../app/views/modulo_administracao/ajustes-gerais/ajustes-gerais.module#AjustesGeraisModule', data: {title: 'Ajustes Gerais'} },
  {path: 'formulario-atendimento', loadChildren: '../app/views/modulo_administracao/formulario-atendimento/formulario-atendimento/formulario-atendimento.module#FormularioAtendimentoModule', data: {title: 'Formulário de Atendimento'} },
  {path: 'administracao-atendimento', loadChildren: '../app/views/modulo_administracao/formulario-atendimento/administracao-atendimento/administracao-atendimento.module#AdministracaoAtendimentoModule', data: {title: 'Administração de Atendimentos'} },
  {path: 'administracao-responsaveis', loadChildren: '../app/views/modulo_administracao/administracao-responsaveis/administracao-responsaveis.module#AdministracaoResponsaveisModule', data: {title: 'Administração Responsáveis'} },


  // Indicadores
  {path: 'subdivisao', loadChildren: '../app/views/modulo_administracao/subdivisao/subdivisao.module#SubdivisaoModule', data: {title: 'Subdivisões'} },  
  {path: 'bomIndicador', loadChildren: '../app/views/modulo_indicadores/bom-indicador/bom-indicador.module#BomIndicadorModule', data: {title: 'Indicadores » Bom indicador'} },
  {path: 'cadastroindicadores', loadChildren: '../app/views/modulo_indicadores/indicadores/indicadores.module#IndicadoresModule', data: {title: 'Indicadores » Cadastro de Indicadores'} },
  {path: 'variaveis', loadChildren: '../app/views/modulo_indicadores/variaveis/variaveis.module#VariaveisModule', data: {title: 'Indicadores » Cadastro de Variáveis'} },
  {path: 'avaliacaoVariavel', loadChildren: '../app/views/modulo_indicadores/avaliacao-variaveis/avaliacao-variaveis.module#AvaliacaoVariaveisModule', data: {title: 'Indicadores » Avaliação de Variável'} },
  {path: 'painelIndicadoresCidade', loadChildren: '../app/views/modulo_indicadores/painel-indicadores-cidade/painel-indicadores-cidade.module#PainelIndicadoresCidadeModule'},
  {path: 'painel-cidade', loadChildren: '../app/views/modulo_indicadores/painel-indicadores-cidade/painel-indicadores-cidade.module#PainelIndicadoresCidadeModule'},
  {path: 'painel-subdivisoes', loadChildren: '../app/views/modulo_indicadores/painel-indicadores-subdivisao/painel-indicadores-subdivisao.module#PainelIndicadoresSubdivisaoModule'},
  {path: 'indicadores-para-preencher', loadChildren: '../app/views/modulo_indicadores/indicadores-para-preencher/indicadores-para-preencher.module#IndicadoresParaPreencherModule'},
  {path: 'indicadoresParaPreencher', loadChildren: '../app/views/modulo_indicadores/indicadores-para-preencher/indicadores-para-preencher.module#IndicadoresParaPreencherModule'},
  {path: 'indicadores-para-preencher', loadChildren: '../app/views/modulo_indicadores/painel-indicadores-subdivisao/painel-indicadores-subdivisao.module#PainelIndicadoresSubdivisaoModule'},
  {path: 'indicadores/preencher-variaveis', loadChildren: '../app/views/modulo_indicadores/preencher-variaveis/preencher-variaveis.module#PreencherVariaveisModule'},
  {path: 'preencherIndicador/:id', loadChildren: '../app/views/modulo_indicadores/preenchimento-indicadores/preenchimento-indicadores.module#PreenchimentoIndicadoresModule'},
  {path: 'preencher-indicador/:id/:subdivisao', loadChildren: '../app/views/modulo_indicadores/preenchimento-indicadores/preenchimento-indicadores.module#PreenchimentoIndicadoresModule'},
  {path: 'preencher-indicador/:id', loadChildren: '../app/views/modulo_indicadores/preenchimento-indicadores/preenchimento-indicadores.module#PreenchimentoIndicadoresModule'},
  {path: 'mostrarResultado/:id', loadChildren: '../app/views/modulo_indicadores/preenchimento-indicadores-resultado/preenchimento-indicadores-resultado.module#PreenchimentoIndicadoresResultadoModule'},
  {path: 'indicador', loadChildren: '../app/views/modulo_indicadores/indicador-da-cidade/indicador-da-cidade.module#IndicadorDaCidadeModule', data: {title: 'Indicadores » Indicadores'} },
  {path: 'compararIndicadoresDiferentesMesmaCidade', loadChildren: '../app/views/modulo_indicadores/comparacao_mesma_cidade/comparacao-mesma-cidade.module#CompararIndicadoresDiferentesMesmaCidadeModule'},
  {path: 'indicadores', loadChildren: '../app/views/modulo_indicadores/indicadores-inicial/indicadores-inicial.module#IndicadoresInicialModule', data: {title: 'Indicadores » Indicadores'} },
  {path: 'comparacaoIndicadores', loadChildren: '../app/views/modulo_indicadores/comparacao-indicadores/comparacao-indicadores.module#ComparacaoIndicadoresModule', data: {title: 'Indicadores » Comparativo de Cidades'} },
  {path: 'tipoclassificacaoindicadores', loadChildren: '../app/views/modulo_indicadores/tipo-classificacao-indicadores/tipo-classificacao-indicadores.module#TipoClassificacaoIndicadoresModule', data: {title: 'Indicador » Tipos e Classificações de Indicadores'} },
  {path: 'visualizarindicador', loadChildren: '../app/views/modulo_indicadores/indicadores-visualizar/indicadores-visualizar.module#IndicadoresVisualizarModule'},
  {path: 'recalculo-indicador-admin', loadChildren: '../app/views/modulo_indicadores/recalculo-indicadores-admin/recalculo-indicadores-admin.module#RecalculoIndicadoresAdminModule'},

  // Boas Práticas
  {path: 'cadastro-boas-praticas', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas/boas-praticas.module#BoasPraticasModule', data: {title: 'Boas Práticas » Cadastro de Boas Práticas'}},
  {path: 'boaspraticas/cidade', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas-da-cidade/boas-praticas-da-cidade.module#BoasPraticasDaCidadeModule' },
  {path: 'boas-praticas/cidades', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas-da-cidade/boas-praticas-da-cidade.module#BoasPraticasDaCidadeModule' },
  {path: 'boaspraticas/detalhes', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas-detalhes/boas-praticas-detalhes.module#BoasPraticasDetalhesModule', data: {title: 'Boas Práticas » Detalhes'}},
  {path: 'boas-praticas/:id', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas-detalhes/boas-praticas-detalhes.module#BoasPraticasDetalhesModule', data: {title: 'Boas Práticas » Detalhes'}},
  {path: 'boas-praticas', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas-inicial/boas-praticas-inicial.module#BoasPraticasInicialModule', data: {title: 'Boas Práticas » Boas Práticas'} },
  {path: 'boaspraticasinicial', loadChildren: '../app/views/modulo_boas_praticas/boas-praticas-inicial/boas-praticas-inicial.module#BoasPraticasInicialModule', data: {title: 'Boas Práticas » Boas Práticas'} },
  {path: 'sugerir-boa-pratica', loadChildren: '../app/views/modulo_boas_praticas/sugestao-boas-praticas/sugestao-boas-praticas.module#SugestaoBoasPraticasModule' },
  {path: 'versugestaoboaspraticas', loadChildren: '../app/views/modulo_boas_praticas/ver-sugestao-boas-praticas/ver-sugestao-boas-praticas.module#VerSugestaoBoasPraticasModule'},

  // Notícias
  {path: 'cadastro-noticia', loadChildren: '../app/views/modulo_noticias/noticia/noticia.module#NoticiaModule', data: {title: 'Notícias » Cadastro de Notícia'} },
  {path: 'noticias', loadChildren: '../app/views/modulo_noticias/noticias-inicial/noticias-inicial.module#NoticiasInicialModule', data: {title: 'Notícias » Notícias'} },
  {path: 'noticia/detalhe', loadChildren: '../app/views/modulo_noticias/noticia-detalhe/noticia-detalhe.module#NoticiaDetalheModule', data: {title: 'Notícias » Notícias'} },
  {path: 'noticia', loadChildren: '../app/views/modulo_noticias/noticia-detalhe/noticia-detalhe.module#NoticiaDetalheModule', data: {title: 'Notícias » Notícias'} },
  {path: 'boletim', loadChildren: '../app/views/modulo_noticias/boletim/boletim-administracao/boletim-administracao.module#BoletimAdministracaoModule'},

  // Planejamento Integrado
  {path: 'planejamento-integrado/temas-geoespaciais', loadChildren: '../app/views/modulo_planejamento_integrado/tema-geoespacial/tema-geoespacial.module#TemaGeoespacialModule',data: {title: 'Planejamento Integrado » Temas Geoespaciais'}},
  {path: 'planejamento-integrado/cadastro-shapefile', loadChildren: '../app/views/modulo_planejamento_integrado/shape_cadastro/shape-cadastro.module#ShapeCadastroModule', data: {title: 'Planejamento Integrado » Cadastro de Shape'} },
  {path: 'planejamento-integrado/planejamento-integrado', loadChildren: '../app/views/modulo_planejamento_integrado/planejamento-integrado-inicial/planejamento-integrado-inicial.module#PlanejamentoIntegradoInicialModule', data: {title: 'Planejamento Integrado » Planejamento Integrado'} },
  {path: 'planejamento-integrado/sig', loadChildren: '../app/views/modulo_planejamento_integrado/planejamento-integrado-inicial/planejamento-integrado-inicial.module#PlanejamentoIntegradoInicialModule', data: {title: 'Planejamento Integrado » Planejamento Integrado'} },
  {path: 'planejamento-integrado/material-apoio', loadChildren: '../app/views/modulo_planejamento_integrado/material-apoio/material-apoio.module#MaterialApoioModule', data: {title: 'Planejamento Integrado » Materiais de apoio'}},
  {path: 'planejamento-integrado/historico-shapes', loadChildren: '../app/views/modulo_planejamento_integrado/historico-shapes/historico-shapes.module#HistoricoShapesModule', data: {title: 'Planejamento Integrado » Histórico de shapes'} },
  {path: 'planejamento-integrado/historico-uso-shapes', loadChildren: '../app/views/modulo_planejamento_integrado/historico-uso-shapes/historico-uso-shapes.module#HistoricoUsoShapesModule', data: {title: 'Planejamento Integrado » Histórico de uso dos shapes'} },
  {path: 'home', loadChildren: '../app/views/modulo_administracao/home-editor/home-form.module#HomeFormModule', data: {title: 'Home » Editor'}},
  {path: 'inicial/:pagina', loadChildren: '../app/views/modulo_administracao/home/home.module#HomeModule'},

  //Eventos
  {path: 'eventos', loadChildren: '../app/views/modulo_eventos/eventos-principal/eventos-principal.module#EventosPrincipalModule', data: {title: 'Eventos'}},
  {path: 'eventos/lista', loadChildren: '../app/views/modulo_eventos/eventos/eventos.module#EventosModule', data: {title: 'Lista de Eventos'}},
  {path: 'eventos/cadastro', loadChildren: '../app/views/modulo_eventos/eventos-form/eventos-form.module#EventosFormModule', data: {title: 'Eventos » Cadastro De Eventos'}},
  {path: 'eventos/calendario', loadChildren: '../app/views/modulo_eventos/eventos-calendario/eventos-calendario.module#EventosCalendarioModule', data: {title: 'Eventos » Calendário'}},
  {path: 'eventos/detalhe', loadChildren: '../app/views/modulo_eventos/eventos-detalhe/eventos-detalhe.module#EventosDetalheModule', data: {title: 'Eventos » Detalhe Evento'}},

  //Participação Cidadã
  {path: 'participacao-cidada', loadChildren: '../app/views/modulo_participacao_cidada/participacao-cidada-principal/participacao-cidada-principal.module#ParticipacaoCidadaPrincipalModule', data: {title: 'Participação Cidadã'}},
  {path: 'participacao-cidada/formulario', loadChildren: '../app/views/modulo_participacao_cidada/formulario-list/formulario-list.module#FormularioListModule', data: {title: 'Participação Cidadã » Administração de Formulários'}},
  {path: 'participacao-cidada/material-apoio', loadChildren: '../app/views/modulo_participacao_cidada/material-apoio-principal/material-apoio-principal.module#MaterialApoioPrincipalModule', data: {title: 'Participação Cidadã » Materiais de Apoio'}},
  {path: 'formulario', loadChildren: '../app/views/modulo_participacao_cidada/preenchimento-formulario/preenchimento-formulario.module#PreenchimentoFormularioModule', data: {title: 'Participação Cidadã » Preenchimento de Formulários'}},
  {path: 'participacao-cidada/forum', loadChildren: '../app/views/modulo_participacao_cidada/forum-principal/forum-principal.module#ForumPrincipalModule', data: {title: 'Participação Cidadã » Fórum'}},
  {path: 'participacao-cidada/discussoes', loadChildren: '../app/views/modulo_participacao_cidada/forum-discussoes/forum-discussoes.module#ForumDiscussoesModule', data: {title: 'Participação Cidadã » Discussões'}},
  {path: 'proposta', loadChildren: '../app/views/modulo_participacao_cidada/proposta-municipio/proposta-municipio.module#PropostaMunicipioModule'},

  //Mural de Comentários
  {path: 'mural-de-comentarios-form', loadChildren: '../app/views/modulo_participacao_cidada/comentario-form/comentario-form.module#ComentarioFormModule', data: {title: 'Formulário de Comentário'}},
  {path: 'mural-de-comentarios-administracao', loadChildren: '../app/views/modulo_participacao_cidada/comentario-administracao/comentario-administracao.module#ComentarioAdministracaoModule', data: {title: 'Administração de comentários'}},
  {path: 'mural-de-comentarios', loadChildren: '../app/views/modulo_participacao_cidada/comentarios/comentarios.module#ComentariosModule', data: {title: 'Comentários'}},
  {path: 'configuracao-comentario', loadChildren: '../app/views/modulo_participacao_cidada/configuracao-comentario/configuracao-comentario.module#ConfiguracaoComentarioModule', data: {title: 'Participação Cidadã » Configuração comentário'}},

  //FAQ
  {path: 'faq-formulario', loadChildren: '../app/views/modulo_participacao_cidada/faq-form/faq-form.module#FaqFormModule', data: {title: 'Formulário de FAQ'}},
  {path: 'faq', loadChildren: '../app/views/modulo_participacao_cidada/faq/faq.module#FaqModule', data: {title: 'FAQ'}},
  {path: 'faq-administracao', loadChildren: '../app/views/modulo_participacao_cidada/faq-administracao/faq-administracao.module#FaqAdministracaoModule', data: {title: 'Administração do FAQ'}},
  
  //Plano de Metas
  {path: 'plano-de-metas', loadChildren: '../app/views/modulo_plano_de_metas/plano-de-metas.module#PlanoDeMetasModule', data: {title: 'Plano de Metas'}},

  //Biblioteca
  {path: 'biblioteca', loadChildren: '../app/views/modulo_biblioteca/bibliotecas/bibliotecas.module#BibliotecasModule', data: {title: 'Bibliotecas'}},
  {path: 'biblioteca/temas-forum', loadChildren: '../app/views/modulo_biblioteca/temas-forum-list/temas-forum-list.module#TemasForumListModule', data: {title: 'Bibliotecas » Cadastro de Temas de Fórum '}},

  //Planos, Leis e Regulamentações
  {path: 'planos-leis-regulamentacoes', loadChildren: '../app/views/modulo_planos_leis/planos-leis/planos-leis.module#PlanosLeisModule', data: {title: 'Planos, Leis e Regulamentações'}},

  //Capacitação
  {path: 'capacitacao', loadChildren: '../app/views/modulo_capacitacao/capacitacao/capacitacao.module#CapacitacaoModule', data: {title: 'Capacitação'}},
  {path: 'capacitacao/emitir-certificados', loadChildren: '../app/views/modulo_capacitacao/emissor-certificados/emissor-certificados.module#EmissorCertificadosModule', data: {title: 'Capacitação » Emitir Certificados'}},
  {path: 'capacitacao/certificados', loadChildren: '../app/views/modulo_capacitacao/certificado-list/certificado-list.module#CertificadoListModule', data: {title: 'Capacitação » Cadastro de Certificados'}},

  //Contribuições Academicas
  {path: 'colaboracoes-academicas', loadChildren: '../app/views/modulo_contribuicoes_academicas/contribuicoes-academicas-principal/contribuicoes-academicas-principal.module#ContribuicoesAcademicasPrincipalModule', data: {title: 'Contribuições Acadêmicas'}},
  {path: 'colaboracoes-privadas', loadChildren: '../app/views/modulo_contribuicoes_privadas/contribuicoes-privadas-principal/contribuicoes-privadas-principal.module#ContribuicoesPrivadasPrincipalModule', data: {title: 'Contribuições Privadas'}},

  // Busca para plataforma
  {path: 'buscar', loadChildren: '../app/views/buscar/buscar.module#BuscarModule', data: {title: 'Buscar'}},

  {path: 'paginas/:pagina', loadChildren: '../app/views/modulo_administracao/institucional-dinamico/institucional-dinamico.module#InstitucionalDinamicoModule'},
  {path: 'paginas-editor', loadChildren: '../app/views/modulo_administracao/institucional-dinamico-editor/institucional-dinamico-form.module#InstitucionalDinamicoFormModule', data: {title: 'Pagina » Editor'}},
  {path: 'paginas-editor/lista', loadChildren: '../app/views/modulo_administracao/institucional-dinamico-list/institucional-dinamico-list.module#InstitucionalDinamicoListModule', data: {title: 'Paginas'}},

  {path: 'home-editor/lista', loadChildren: '../app/views/modulo_administracao/home-list/home-list.module#HomeListModule', data: {title: 'Paginas'}},

  {path: '**', redirectTo: 'inicial/home', pathMatch: 'full', data: {pagina: 'home'}},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
