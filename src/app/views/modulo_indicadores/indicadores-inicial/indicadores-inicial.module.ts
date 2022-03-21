import { BreadcrumbModule2 } from './../../../components/breadcrumb2/breadcrumb.module2';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { IndicadoresInicialComponent } from './indicadores-inicial.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicadoresInicialRoutingModule } from './indicadores-inicial-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatAutocompleteModule, MatRadioModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeradorUrlCidadeModule } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.module';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LegendaGraficoModule } from 'src/app/components/legenda-grafico/legenda-grafico.module';
import { GeradorUrlIndicadorPipe } from 'src/app/components/geradorUrlIndicador/gerador-url-indicador.pipe';
import { GeradorUrlIndicadorModule } from 'src/app/components/geradorUrlIndicador/gerador-url-indicador.module';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { HomeModule } from '../../modulo_administracao/home/home.module';
import { IndicadoresInicialHeaderModule } from './indicadores-inicial-header/indicadores-inicial-header.module';
import { IndicadoresInicialSecoesModule } from './indicadores-inicial-secoes/indicadores-inicial-secoes.module';

@NgModule({
  declarations: [
    IndicadoresInicialComponent,
    ],
  imports: [
    CommonModule,
    MatButtonModule,
    IndicadoresInicialRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    LeafletModule.forRoot(),
    ChartsModule,
    MatTooltipModule,
    NgxChartsModule,
    MatIconModule,
    GeradorUrlCidadeModule,
    MatAutocompleteModule,
    BreadcrumbModule2,
    ScrollToModule.forRoot(),
    LegendaGraficoModule,
    GeradorUrlIndicadorModule,
    LeafletMarkerClusterModule.forRoot(),
    MatProgressBarModule,
    HomeModule,
    IndicadoresInicialHeaderModule,
    IndicadoresInicialSecoesModule,

  ]
})
export class IndicadoresInicialModule { }
