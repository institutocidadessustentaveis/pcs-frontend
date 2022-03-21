import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatDialogModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, MatChipsModule, MatProgressBarModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PropostaMunicipioComponent } from './proposta-municipio.component';
import { PropostaMunicipioRoutingModule } from './proposta-municipio-routing';




@NgModule({
  declarations: [PropostaMunicipioComponent],
  imports: [
    CommonModule,
    PropostaMunicipioRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    BreadcrumbModule,
    ChartsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressBarModule
  ]
})
export class PropostaMunicipioModule { }
