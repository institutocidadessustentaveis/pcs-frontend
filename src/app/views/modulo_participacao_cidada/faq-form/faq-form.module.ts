import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FaqFormComponent } from './faq-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqFormRoutingModule } from './faq-form-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [FaqFormComponent],
  imports: [
    CommonModule,
    FaqFormRoutingModule,
    MatCardModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxSummernoteModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class FaqFormModule { }
