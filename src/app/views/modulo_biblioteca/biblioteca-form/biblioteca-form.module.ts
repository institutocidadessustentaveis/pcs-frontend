import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatTooltipModule, MatListModule, MatOptionModule, MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { BibliotecaFormComponent } from './biblioteca-form.component';
import { BibliotecaFormRoutingModule } from './biblioteca-form-routing.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [BibliotecaFormComponent],
  imports: [
    CommonModule,
    BibliotecaFormRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    NgxSummernoteModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    ImageCropperModule,
    MatTableModule,
    MatProgressSpinnerModule
  ]
})
export class BibliotecaFormModule { }
