import { GrupoAcademicoPainelModule } from './../grupo-academico-painel/grupo-academico-painel.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatProgressBarModule, MatProgressSpinnerModule, MatFormFieldModule, MatButtonModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatCheckboxModule, MatListModule, MatTableModule, MatSort, MatSortModule, MatPaginatorModule } from '@angular/material';
import { ShareModule } from '@ngx-share/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GruposAcademicosComponent } from './grupos-academicos.component';
import { GruposAcademicosRoutingModule } from './grupos-academicos-routing.module';
import { EventosCalendarioModule } from '../../modulo_eventos/eventos-calendario/eventos-calendario.module';

@NgModule({
  declarations: [GruposAcademicosComponent],
  imports: [
    CommonModule,
    GruposAcademicosRoutingModule,
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
    MatListModule,
    GrupoAcademicoPainelModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class GruposAcademicosModule { }
