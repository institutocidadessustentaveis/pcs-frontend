import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule,
  MatSlideToggleModule, MatTooltipModule, MatTabsModule } from '@angular/material';

import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

import { NgxMaskModule } from 'ngx-mask';

import { PrefeituraAdminRoutingModule } from './prefeitura-admin-routing.module';
import { PrefeituraAdminComponent } from './prefeitura-admin.component';
import { PrefeituraAdminFormComponent } from '../prefeitura-admin-form/prefeitura-admin-form.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [PrefeituraAdminComponent, PrefeituraAdminFormComponent],
  imports: [
    CommonModule,
    PrefeituraAdminRoutingModule,
    FormsModule,
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
    MatTooltipModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatepickerPCSModule,
    NgxMaskModule.forRoot(),
    BreadcrumbModule,
    DadosDownloadModule
  ]
})
export class PrefeituraAdminModule { }
