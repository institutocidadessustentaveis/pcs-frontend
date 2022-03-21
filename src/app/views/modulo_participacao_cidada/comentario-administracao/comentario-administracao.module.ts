import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioAdministracaoComponent } from './comentario-administracao.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatDividerModule, MatTooltipModule } from '@angular/material';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ComentarioAdministracaoRoutingModule } from './comentario-administracao-routing.module';

@NgModule({
  declarations: [ComentarioAdministracaoComponent],
  imports: [
    CommonModule,
    ComentarioAdministracaoRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    BreadcrumbModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    
  ]
})
export class ComentarioAdministracaoModule { }
