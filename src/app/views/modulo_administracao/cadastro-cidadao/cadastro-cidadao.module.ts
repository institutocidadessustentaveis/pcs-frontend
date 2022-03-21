import { NgxMaskModule } from 'ngx-mask';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatRadioModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { CadastroCidadaoRoutingModule } from './cadastro-cidadao-routing.module';
import { CadastroCidadaoComponent } from './cadastro-cidadao.component';

@NgModule({
  declarations: [CadastroCidadaoComponent],
  imports: [
    CommonModule,
    CadastroCidadaoRoutingModule,
    ReactiveFormsModule,
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
    NgxCaptchaModule,
    NgxMaskModule.forRoot(),
  ]
})
export class CadastroCidadaoModule { }
