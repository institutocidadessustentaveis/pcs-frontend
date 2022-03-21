import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerPCSModule } from './../../../components/datepicker/datepickerpcs.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentariosRoutingModule } from './comentarios-routing.module';
import { ComentariosComponent } from './comentarios.component';
import { MatCardModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatTooltipModule, MatButtonModule } from '@angular/material';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [ComentariosComponent],
  imports: [
    CommonModule,
    ComentariosRoutingModule,
    MatCardModule,
    MatIconModule,
    BreadcrumbModule,
    NgxSummernoteModule,
    DatepickerPCSModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class ComentariosModule { }
