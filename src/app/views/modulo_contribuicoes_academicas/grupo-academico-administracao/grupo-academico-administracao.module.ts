import { BreadcrumbModule } from '../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoAcademicoAdministracaoComponent } from './grupo-academico-administracao.component';
import { MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatDividerModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { GrupoAcademicoAdministracaoRoutingModule } from './grupo-academico-administracao-routing.module';
import { ModalInfoAcademicosComponent } from './modal-info-academicos/modal-info-academicos.component';
import { ModalErroAcademicosComponent } from './modal-erro/modal-erro-academicos.component';


@NgModule({
  declarations: [ ModalErroAcademicosComponent, ModalInfoAcademicosComponent, GrupoAcademicoAdministracaoComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    GrupoAcademicoAdministracaoRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
    
  ],
  entryComponents: [ModalErroAcademicosComponent, ModalInfoAcademicosComponent],
})
export class GrupoAcademicoAdministracaoModule { }
