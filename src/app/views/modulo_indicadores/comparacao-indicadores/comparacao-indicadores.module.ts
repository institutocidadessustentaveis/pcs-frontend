import { LegendaGraficoModule } from './../../../components/legenda-grafico/legenda-grafico.module';
import { BreadcrumbModule2 } from './../../../components/breadcrumb2/breadcrumb.module2';
import { ComparacaoIndicadoresComponent } from './comparacao-indicadores.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComparacaoIndicadoresRoutingModule } from './comparacao-indicadores-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatAutocompleteModule, MatButtonModule, MatTooltipModule, MatRadioModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { GeradorUrlIndicadorModule } from 'src/app/components/geradorUrlIndicador/gerador-url-indicador.module';

@NgModule({
  declarations: [ComparacaoIndicadoresComponent],
  imports: [
    CommonModule,
    ComparacaoIndicadoresRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LeafletModule.forRoot(),
    ChartsModule,
    NgxChartsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatRadioModule,
    MatButtonModule,
    ScrollToModule.forRoot(),
    BreadcrumbModule2,
    LegendaGraficoModule,
    GeradorUrlIndicadorModule
  ]
})
export class ComparacaoIndicadoresModule { }
