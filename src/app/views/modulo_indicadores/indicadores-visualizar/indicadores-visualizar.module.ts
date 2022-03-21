import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeradorUrlCidadePipe } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.pipe';
import { IndicadoresVisualizarRoutingModule } from './indicadores-visualizar-routing.module';
import { IndicadoresVisualizarComponent } from './indicadores-visualizar.component';
import { GeradorUrlCidadeModule } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.module';
import { LegendaGraficoModule } from 'src/app/components/legenda-grafico/legenda-grafico.module';

@NgModule({
  declarations: [
    IndicadoresVisualizarComponent,
    ],
  imports: [
    CommonModule,
    IndicadoresVisualizarRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LeafletModule.forRoot(),
    ChartsModule,
    NgxChartsModule,
    MatIconModule,
    GeradorUrlCidadeModule,
    MatProgressBarModule,
    LegendaGraficoModule
  ]
})
export class IndicadoresVisualizarModule { }
