import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoasPraticasCidadesSignatariasComponent } from './boas-praticas-cidades-signatarias.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { MatCardModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';

@NgModule({
  declarations: [BoasPraticasCidadesSignatariasComponent],
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
export class BoasPraticasCidadesSignatariasModule { }
