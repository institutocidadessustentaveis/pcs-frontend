import { ShapesCadastradosComponent } from './relatorios/shapes-cadastrados/shapes-cadastrados.component';
import { BreadcrumbModule } from './../../components/breadcrumb/breadcrumb.module';
import  localePt  from '@angular/common/locales/pt';
import { RelatorioConteudoCompartilhadoComponent } from './relatorios/relatorio-conteudo-compartilhado/relatorio-conteudo-compartilhado.component';
import { QuantidadeIndicadoresPreenchidosComponent } from './relatorios/quantidade-indicadores-preenchidos/quantidade-indicadores-preenchidos.component';
import { QuantidadeIndicadoresCadastradosComponent } from './relatorios/quantidade-indicadores-cadastrados/quantidade-indicadores-cadastrados.component';
import { InteracaoComFerramentasComponent } from './relatorios/interacao-com-ferramentas/interacao-com-ferramentas.component';
import { MatCardModule, MatFormField, MatNativeDateModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatSelectModule, MatPaginatorModule, MatDatepickerModule, MatTableModule, MatSortModule, MatIconModule, MatProgressBarModule, MatToolbarModule, MatAutocompleteModule, MatButtonModule, MatRadioModule, MatExpansionModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioRoutingModule } from './relatorio-routing.module';
import { RelatorioComponent, DropDownList } from './relatorio.component';
import { AcoesGestoresMunicipaisComponent } from './relatorios/acoes-gestores-municipais/acoes-gestores-municipais.component';
import { AtividadeUsuarioComponent } from './relatorios/atividade-usuario/atividade-usuario.component';
import { DownloadExportacoesComponent } from './relatorios/download-exportacoes/download-exportacoes.component';
import { EventosComponent } from './relatorios/eventos/eventos.component';
import { HistoricoRelatorioGeradoComponent } from './relatorios/historico-relatorio-gerado/historico-relatorio-gerado.component';
import { IndicadoresPreenchidosComponent } from './relatorios/indicadores-preenchidos/indicadores-preenchidos.component';
import { InteracaoChatForumComponent } from './relatorios/interacao-chat-forum/interacao-chat-forum.component';
import { RelatorioPlanoDeMetasComponent } from './relatorios/relatorio-plano-de-metas/relatorio-plano-de-metas.component';
import { RelatorioSessoesUsuariosComponent } from './relatorios/relatorio-sessoes-usuarios/relatorio-sessoes-usuarios.component';
import { VisualizacaoCartograficaComponent } from './relatorios/visualizacao-cartografica/vizualizacao-cartografica.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { registerLocaleData } from '@angular/common';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { ShapesExportadosComponent } from './relatorios/shapes-exportados/shapes-exportados.component';
import { ShapesCadastradosPrefeituraComponent } from './relatorios/shapes-cadastrados-prefeitura/shapes-cadastrados-prefeitura.component';
import { PlanoMetasPrestacaoContasComponent } from './relatorios/plano-metas-prestacao-contas/plano-metas-prestacao-contas.component';
import { RelatorioDeEventosComponent } from './relatorios/relatorio-de-eventos/relatorio-de-eventos.component';
import { BoasPraticasPcsComponent } from './relatorios/boas-praticas-pcs/boas-praticas-pcs.component';
import { ContagemBoasPraticasPcsComponent } from './relatorios/contagem-boas-praticas-pcs/contagem-boas-praticas-pcs.component';
import { BoasPraticasCidadesSignatariasComponent } from './relatorios/boas-praticas-cidades-signatarias/boas-praticas-cidades-signatarias.component';
import { ContagemBoasPraticasCidadesSignatariasComponent } from './relatorios/contagem-boas-praticas-cidades-signatarias/contagem-boas-praticas-cidades-signatarias.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';
import { ExportadorRelatoriosComponent } from './relatorios/exportador-relatorios/exportador-relatorios.component';
import { RegistroUsuariosComponent } from './relatorios/registro-usuarios/registro-usuarios.component';
import { IndicadoresCompletoComponent } from './relatorios/indicadores-completo/indicadores-completo.component';
import { RelatorioApiPublicaComponent } from './relatorios/relatorio-api-publica/relatorio-api-publica.component';
registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [RelatorioComponent,
    AcoesGestoresMunicipaisComponent,
    AtividadeUsuarioComponent,
    DownloadExportacoesComponent,
    EventosComponent,
    HistoricoRelatorioGeradoComponent,
    IndicadoresPreenchidosComponent,
    InteracaoChatForumComponent,
    HistoricoRelatorioGeradoComponent,
    IndicadoresPreenchidosComponent,
    InteracaoChatForumComponent,
    InteracaoComFerramentasComponent,
    QuantidadeIndicadoresCadastradosComponent,
    QuantidadeIndicadoresPreenchidosComponent,
    RelatorioConteudoCompartilhadoComponent,
    RelatorioPlanoDeMetasComponent,
    RelatorioSessoesUsuariosComponent,
    VisualizacaoCartograficaComponent,
    ShapesCadastradosComponent,
    ShapesExportadosComponent,
    ShapesCadastradosPrefeituraComponent,
    PlanoMetasPrestacaoContasComponent,
    RelatorioDeEventosComponent,
    BoasPraticasPcsComponent,
    ContagemBoasPraticasPcsComponent,
    BoasPraticasCidadesSignatariasComponent,
    ContagemBoasPraticasCidadesSignatariasComponent,
    ExportadorRelatoriosComponent,
    RegistroUsuariosComponent,
    IndicadoresCompletoComponent,
    RelatorioApiPublicaComponent
  ],
  imports: [
    CommonModule,
    RelatorioRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    DatepickerPCSModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatTooltipModule,
    BreadcrumbModule,
    DadosDownloadModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],

})
export class RelatorioModule { }
