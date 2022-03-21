import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatTabsModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { AvaliacaoVariaveisRoutingModule } from './avaliacao-variaveis-routing.module';
import { AvaliacaoVariaveisListComponent } from './avaliacao-variaveis-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { AvaliacaoVariaveisComponent } from './avaliacao-variaveis.component';
import { AvaliacaoVariaveisDetalhes } from '../avaliacao-variaveis-detalhes/avaliacao-variaveis-detalhes.component';

@NgModule({
  declarations: [AvaliacaoVariaveisComponent, AvaliacaoVariaveisListComponent, AvaliacaoVariaveisDetalhes] ,
  imports: [
    CommonModule,
    AvaliacaoVariaveisRoutingModule,
    ReactiveFormsModule,
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
    MatTabsModule,
    MatListModule,
    NgxMaskModule.forRoot(),
    BreadcrumbModule
  ]
})
export class AvaliacaoVariaveisModule { }
