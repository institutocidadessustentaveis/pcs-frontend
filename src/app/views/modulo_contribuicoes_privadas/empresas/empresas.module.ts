import { GrupoAcademicoPainelModule } from '../../modulo_contribuicoes_academicas/grupo-academico-painel/grupo-academico-painel.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from '../../../components/breadcrumb/breadcrumb.module';
import { MatProgressBarModule, MatProgressSpinnerModule, MatFormFieldModule, MatButtonModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatCheckboxModule, MatTableModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { ShareModule } from '@ngx-share/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosCalendarioModule } from '../../modulo_eventos/eventos-calendario/eventos-calendario.module';
import { EmpresasComponent } from './empresas.component';
import { EmpresasRoutingModule } from './empresas-routing.module';


@NgModule({
  declarations: [EmpresasComponent],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    EventosCalendarioModule,
    LeafletModule.forRoot(),
    ShareModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    GrupoAcademicoPainelModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class EmpresasModule { }
