import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatProgressSpinnerModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioFormComponent } from './usuario_form.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';
@NgModule({
  declarations: [UsuariosComponent, UsuarioFormComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
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
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    DadosDownloadModule
  ]
})
export class UsuariosModule { }
