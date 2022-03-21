import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatTabsModule  } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompararIndicadoresDiferentesMesmaCidadeRoutingModule } from './comparacao-mesma-cidade-routing.module';
import { CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent } from '../comparacao_mesma_cidade_grupo_cidade/comparacao-mesma-cidade-grupo-cidade.component';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CompararIndicadoresDiferentesMesmaCidadeComponent } from './comparacao-mesma-cidade.component';
import { CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent } from '../comparacao_mesma_cidade_detalhes/comparacao-mesma-cidade-detalhes.component';
import { CompararIndicadoresDiferentesMesmaCidadeGraficosComponent } from '../comparacao_mesma_cidade_graficos/comparacao-mesma-cidade-graficos.component';
import { ChartsModule } from 'ng2-charts';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
      CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent,
      CompararIndicadoresDiferentesMesmaCidadeComponent,
      CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent,
      CompararIndicadoresDiferentesMesmaCidadeGraficosComponent],
  imports: [
    CommonModule,
    CompararIndicadoresDiferentesMesmaCidadeRoutingModule,
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
    ChartsModule,
    ShareModule,
    AngularFontAwesomeModule,
    NgxChartsModule,
    NgxMaskModule.forRoot(),
    LeafletModule.forRoot(),
    AutocompleteLibModule
  ]
})
export class CompararIndicadoresDiferentesMesmaCidadeModule { }
