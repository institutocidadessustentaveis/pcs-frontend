import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSortModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { ProvinciaEstadoRoutingModule } from './provincia-estado-routing.module';
import { ProvinciaEstadoComponent } from './provincia-estado.component';
import { ProvinciaEstadoFormComponent } from '../provincia-estado-form/provincia-estado-form.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ProvinciaEstadoComponent, ProvinciaEstadoFormComponent],
  imports: [
    CommonModule,
    ProvinciaEstadoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatSortModule,
    MatAutocompleteModule,
    BreadcrumbModule
  ]
})
export class ProvinciaEstadoModule { }
