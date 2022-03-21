import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricoCidadesSignatariasComponent } from './historico-cidades-signatarias.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { MatCardModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [HistoricoCidadesSignatariasComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class HistoricoCidadesSignatariasModule { }
