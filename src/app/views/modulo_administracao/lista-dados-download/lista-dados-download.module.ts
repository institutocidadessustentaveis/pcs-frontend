import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerPCSModule } from './../../../components/datepicker/datepickerpcs.module';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatProgressBarModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaDadosDownloadRoutingModule } from './lista-dados-download-routing.module';
import { ListaDadosDownloadComponent } from './lista-dados-download.component';

@NgModule({
  declarations: [
    ListaDadosDownloadComponent,
  ],
  imports: [
    CommonModule,
    ListaDadosDownloadRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    DatepickerPCSModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule,
  ]
})
export class ListaDadosDownloadModule { }
