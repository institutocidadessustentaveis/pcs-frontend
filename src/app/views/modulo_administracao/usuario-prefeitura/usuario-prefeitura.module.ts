import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioPrefeituraRoutingModule } from './usuario-prefeitura-routing.module';
import { UsuarioPrefeituraComponent } from './usuario-prefeitura.component';
import { UsuarioPrefeituraFormComponent } from '../usuario-prefeitura-form/usuario-prefeitura-form.component';
import { MatCardModule, MatIconModule, MatProgressBarModule, MatDialogModule, MatInputModule, MatOptionModule, MatSelectModule, MatTableModule, MatCheckboxModule, MatRadioModule, MatListModule, MatAutocompleteModule, MatButtonModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { HasRoleModule } from 'src/app/components/has-role/has-role.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [UsuarioPrefeituraComponent, UsuarioPrefeituraFormComponent],
  imports: [
    CommonModule,
    UsuarioPrefeituraRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule ,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatPaginatorModule,
    NgxMaskModule.forRoot(),
    MatSortModule,
    BreadcrumbModule,
    HasRoleModule,
    DadosDownloadModule
  ]
})
export class UsuarioPrefeituraModule { }
