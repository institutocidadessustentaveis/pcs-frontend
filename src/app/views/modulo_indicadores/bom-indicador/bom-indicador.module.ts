import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BomIndicadorRoutingModule } from './bom-indicador-routing.module';
import { BomIndicadorComponent } from './bom-indicador.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ParticlesModule } from 'angular-particle';

@NgModule({
  declarations: [BomIndicadorComponent],
  imports: [
    CommonModule,
    BomIndicadorRoutingModule,
    NgxSummernoteModule,
    MatProgressSpinnerModule,
    ParticlesModule,
    BreadcrumbModule
  ]
})
export class BomIndicadorModule { }
