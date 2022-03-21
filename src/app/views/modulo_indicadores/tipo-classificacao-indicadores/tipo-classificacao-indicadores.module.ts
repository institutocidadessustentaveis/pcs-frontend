import { TipoClassificacaoIndicadoresComponent } from './tipo-classificacao-indicadores.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { TipoClassificacaoIndicadoresRoutingModule } from './tipo-classificacao-indicadores-routing.module';
import { ParticlesModule } from 'angular-particle';
@NgModule({
  declarations: [TipoClassificacaoIndicadoresComponent],
  imports: [
    CommonModule,
    HttpClientModule,
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
    TipoClassificacaoIndicadoresRoutingModule,
    ParticlesModule,
  ]
})
export class TipoClassificacaoIndicadoresModule { }
