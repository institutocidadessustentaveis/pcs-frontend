import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule  } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';

import { VariaveisRoutingModule } from './variaveis-routing.module';
import { VariavelListComponent } from './variaveis-list.component';
import { VariavelComponent } from './variaveis.component';

@NgModule({
  declarations: [VariavelListComponent,VariavelComponent],
  imports: [
    CommonModule,
    VariaveisRoutingModule,
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
    MatListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(),
    BreadcrumbModule
  ]
})
export class VariaveisModule { }
