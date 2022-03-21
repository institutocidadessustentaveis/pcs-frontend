import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { BibliotecaAdministracaoRoutingModule } from './biblioteca-administracao-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecaAdministracaoComponent } from './biblioteca-administracao.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatDividerModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [BibliotecaAdministracaoComponent],
  imports: [
    CommonModule,
    BibliotecaAdministracaoRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    MatDividerModule,
    MatInputModule,
    MatPaginatorModule,
  ]
})
export class BibliotecaAdministracaoModule { }
