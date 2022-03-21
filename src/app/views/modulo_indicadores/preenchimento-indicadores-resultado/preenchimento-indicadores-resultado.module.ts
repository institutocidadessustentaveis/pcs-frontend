import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule, MatTabsModule, MatTooltipModule, MatSlideToggleModule, MatProgressSpinnerModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { PreenchimentoIndicadoresResultadoRoutingModule } from './preenchimento-indicadores-resultado-routing.module';
import { PreenchimentoIndicadoresResultadoComponent } from './preenchimento-indicadores-resultado.component';

@NgModule({
  declarations: [PreenchimentoIndicadoresResultadoComponent],
  imports: [
    CommonModule,
    PreenchimentoIndicadoresResultadoRoutingModule,
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
    MatProgressSpinnerModule,
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
  ]
})
export class PreenchimentoIndicadoresResultadoModule { }
