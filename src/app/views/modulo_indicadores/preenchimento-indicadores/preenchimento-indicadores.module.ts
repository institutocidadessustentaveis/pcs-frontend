import { BrowserModule } from '@angular/platform-browser';
import { PreenchimentoIndicadoresComponent } from './preenchimento-indicadores.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule, MatTabsModule, MatTooltipModule, MatSlideToggleModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { PreenchimentoIndicadoresRoutingModule } from './preenchimento-indicadores-routing.module';
import { PreenchimentoIndicadoresVariaveisComponent } from './preenchimento-indicadores-variaveis/preenchimento-indicadores-variaveis.component';
import { PainelIndicadoresCidadeModule } from '../painel-indicadores-cidade/painel-indicadores-cidade.module';
import { SlugifyModule } from 'src/app/components/slugify/slugify.module';

@NgModule({
  declarations: [PreenchimentoIndicadoresComponent, PreenchimentoIndicadoresVariaveisComponent],
  imports: [
    CommonModule,
    PreenchimentoIndicadoresRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    NgxMaskModule.forRoot(),
    PainelIndicadoresCidadeModule,
    SlugifyModule
  ]
})
export class PreenchimentoIndicadoresModule { }
