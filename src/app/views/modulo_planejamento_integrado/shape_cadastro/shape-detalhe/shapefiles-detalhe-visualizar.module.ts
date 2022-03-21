import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatStepperModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeradorUrlCidadePipe } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.pipe';
import { ShapeFilesDetalheVisualizarRoutingModule } from './shapefiles-detalhe-visualizar-routing.module';
import { ShapeFilesDetalheVisualizarComponent } from './shapefiles-detalhe-visualizar.component';
import { GeradorUrlCidadeModule } from 'src/app/components/geradorUrlCidade/gerador-url-cidade.module';
import { LegendaGraficoModule } from 'src/app/components/legenda-grafico/legenda-grafico.module';
import { ShapeFileService } from 'src/app/services/shapefile.service';

@NgModule({
  declarations: [
    ShapeFilesDetalheVisualizarComponent,
    ],
  imports: [
    CommonModule,
    ShapeFilesDetalheVisualizarRoutingModule,
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
    LegendaGraficoModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,     
    MatStepperModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  
})
export class ShapeFilesDetalheVisualizarModule { }
