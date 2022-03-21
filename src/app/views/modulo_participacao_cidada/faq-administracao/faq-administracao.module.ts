import { FaqAministracaoRoutingModule } from './faq-administracao-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqAdministracaoComponent } from './faq-administracao.component';
import { MatTableModule, MatIconModule, MatCardModule, MatDividerModule, MatPaginatorModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [FaqAdministracaoComponent],
  imports: [
    FaqAministracaoRoutingModule,
    CommonModule,
    BreadcrumbModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    NgxSummernoteModule,
    MatTooltipModule,
    
    
  ]
})
export class FaqAdministracaoModule { }
