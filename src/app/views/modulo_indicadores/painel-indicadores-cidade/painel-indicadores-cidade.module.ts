import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatTabsModule  } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PainelIndicadoresCidadeRoutingModule } from './painel-indicadores-cidade-routing.module';
import { PainelIndicadoresCidadeComponent } from './painel-indicadores-cidade.component';
import { PainelIndicadoresCidadeDetalhesComponent } from './painel-indicadores-cidade-detalhes/painel-indicadores-cidade-detalhes.component';
import { PainelIndicadoresCidadeGrupoCidadeComponent } from './painel-indicadores-cidade-grupo-cidade/painel-indicadores-cidade-grupo-cidade.component';
import { PainelIndicadoresCidadeGrupoIndicadoresComponent } from './painel-indicadores-cidade-grupo-indicadores/painel-indicadores-cidade-grupo-indicadores.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ParticlesModule } from 'angular-particle';
import { ListaIndicadoresEixoComponent } from '../lista-indicadores-eixo/lista-indicadores-eixo.component';
import { ListaVariavelPreenchidaComponent } from '../lista-variavel-preenchida/lista-variavel-preenchida.component';
import { CorReferenciaPipeModule } from 'src/app/components/corReferenciaPipe/cor-referencia-pipe.module';
import { EventosCalendarioModule } from '../../modulo_eventos/eventos-calendario/eventos-calendario.module';
import { SlugifyModule } from 'src/app/components/slugify/slugify.module';
import { IndicadoresParaPreencherModule } from '../indicadores-para-preencher/indicadores-para-preencher.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [PainelIndicadoresCidadeComponent, PainelIndicadoresCidadeDetalhesComponent, PainelIndicadoresCidadeGrupoCidadeComponent, PainelIndicadoresCidadeGrupoIndicadoresComponent,ListaIndicadoresEixoComponent,ListaVariavelPreenchidaComponent],
  imports: [
    CorReferenciaPipeModule,
    CommonModule,
    PainelIndicadoresCidadeRoutingModule,
    EventosCalendarioModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    NgxMaskModule.forRoot(),
    LeafletModule.forRoot(),
    ParticlesModule,
    SlugifyModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatDialogModule,
    DadosDownloadModule
  ],
  exports: [ListaVariavelPreenchidaComponent],  
})
export class PainelIndicadoresCidadeModule { }
