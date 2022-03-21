import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioFormRoutingModule } from './comentario-form-routing.module';
import { ComentarioFormComponent } from './comentario-form.component';
import { MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ComentarioFormComponent],
  imports: [
    CommonModule,
    ComentarioFormRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    BreadcrumbModule,
    MatCardModule,
    MatIconModule,
    NgxSummernoteModule,
    NgxMaskModule,
    MatCheckboxModule,
  ]
})
export class ComentarioFormModule { }
