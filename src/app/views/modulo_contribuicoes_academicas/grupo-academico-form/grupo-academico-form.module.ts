import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoAcademicoFormComponent } from './grupo-academico-form.component';
import { GrupoAcademicoFormRoutingModule } from './grupo-academico-form-routing.module';
import { MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule, MatProgressBarModule, MatStepperModule, MatCheckboxModule, MatFormFieldModule, MatSnackBarModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ GrupoAcademicoFormComponent],
  imports: [
    CommonModule,
    GrupoAcademicoFormRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxSummernoteModule,
    MatTooltipModule,
    NgxMaskModule.forRoot(),
    LeafletModule.forRoot(),
    MatProgressBarModule,
    MatStepperModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ]
})
export class GrupoAcademicoFormModule { }
