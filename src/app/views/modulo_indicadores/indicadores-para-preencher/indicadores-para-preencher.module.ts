import { HttpClientModule } from '@angular/common/http';
import { UsuariosRoutingModule } from './../../modulo_administracao/usuarios/usuarios-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { IndicadoresParaPreencherRoutingModule } from './indicadores-para-preencher-routing.module';
import { ModalErroComponent } from './modal-erro/modal-erro.component';
import { IndicadoresParaPreencherComponent } from './indicadores-para-preencher.component';
import { PainelIndicadoresCidadeModule } from '../painel-indicadores-cidade/painel-indicadores-cidade.module';
import { SlugifyModule } from 'src/app/components/slugify/slugify.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';
import { ModalInfoVariaveisComponent } from './modal-info-variaveis/modal-info-variaveis.component';

@NgModule({
  declarations: [ModalErroComponent, ModalInfoVariaveisComponent, IndicadoresParaPreencherComponent],
  imports: [
    CommonModule,
    IndicadoresParaPreencherRoutingModule,
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
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    PainelIndicadoresCidadeModule,
    SlugifyModule,
    DadosDownloadModule
  ],
  entryComponents: [ModalErroComponent, ModalInfoVariaveisComponent],
})
export class IndicadoresParaPreencherModule { }
