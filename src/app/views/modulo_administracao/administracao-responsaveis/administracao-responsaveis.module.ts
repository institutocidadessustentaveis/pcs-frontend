import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracaoResponsaveisRoutingModule } from './administracao-responsaveis-routing.module';
import { AdministracaoResponsaveisComponent } from './administracao-responsaveis.component';
import { MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { AdministracaoResponsaveisFormComponent } from './administracao-responsaveis-form/administracao-responsaveis-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScripCriarUsuariosPrefeitosComponent } from './scrip-criar-usuarios-prefeitos/scrip-criar-usuarios-prefeitos.component';

@NgModule({
  declarations: [AdministracaoResponsaveisComponent, AdministracaoResponsaveisFormComponent, ScripCriarUsuariosPrefeitosComponent],
  imports: [
    CommonModule,
    AdministracaoResponsaveisRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    RouterModule
  ]
})
export class AdministracaoResponsaveisModule { }
