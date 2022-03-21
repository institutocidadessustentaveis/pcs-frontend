import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatTabsModule  } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PainelComparativoIndicadoresCidadeRoutingModule } from './painel-comparativo-indicadores-cidade-routing.module';
import { PainelComparativoIndicadoresCidadeComponent } from './painel-comparativo-indicadores-cidade.component';

//import { PainelIndicadoresCidadeDetalhesComponent } from './painel-indicadores-cidade-detalhes/painel-indicativo-indicadores-cidade-detalhes.component';
//import { PainelIndicadoresCidadeGrupoCidadeComponent } from './painel-indicadores-cidade-grupo-cidade/painel-indicadores-cidade-grupo-cidade.component';
//import { PainelIndicadoresCidadeGrupoIndicadoresComponent } from './painel-indicadores-cidade-grupo-indicadores/painel-indicadores-cidade-grupo-indicadores.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IndicadoresDetalhesComponent } from './comparativo-indicadores-detalhes/indicadores-detalhes.component';
import { ChartsModule } from 'ng2-charts';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

@NgModule({
  declarations: [PainelComparativoIndicadoresCidadeComponent, IndicadoresDetalhesComponent, ],
  imports: [
    CommonModule,
    PainelComparativoIndicadoresCidadeRoutingModule,
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
    MatRadioModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    NgxMaskModule.forRoot(),
    LeafletModule.forRoot(),
    ChartsModule,
    ShareModule,
    AngularFontAwesomeModule,
    NgxChartsModule,
    DatepickerPCSModule
  ]
})
export class PainelComparativoIndicadoresCidadeModule { }
