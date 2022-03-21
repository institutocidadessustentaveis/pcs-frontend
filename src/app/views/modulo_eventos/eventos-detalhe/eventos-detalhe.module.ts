import { NgModule } from '@angular/core';
import { ShareModule } from '@ngx-share/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatProgressBarModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeradorUrlCidadePipe } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.pipe';
import { GeradorUrlCidadeModule } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.module';
import { LegendaGraficoModule } from 'src/app/components/legenda-grafico/legenda-grafico.module';
import { EventosDetalheComponent } from './eventos-detalhe.component';
import { EventosDetalheRoutingModule } from './eventos-detalhe-routing.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    EventosDetalheComponent,
    ],
  imports: [
    CommonModule,
    EventosDetalheRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    LeafletModule.forRoot(),
    ChartsModule,
    NgxChartsModule,
    MatIconModule,
    GeradorUrlCidadeModule,
    MatProgressBarModule,
    LegendaGraficoModule,
    BreadcrumbModule,
    ShareModule,
    AngularFontAwesomeModule,
    MatTooltipModule
  ]
})
export class EventosDetalheModule { }
