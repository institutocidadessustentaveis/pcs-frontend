import { HasRoleModule } from 'src/app/components/has-role/has-role.module';
import { StripTagsModule } from 'src/app/components/strip-tags/strip-tags.module';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ReactiveFormsModule } from '@angular/forms';
import { PreenchimentoFormularioRoutingModule } from './preenchimento-formulario-routing.module';
import { MatCardModule, MatIconModule, MatDividerModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatDatepickerModule, MatListModule, MatExpansionModule, MatTreeModule, MatProgressSpinnerModule, MatStepperModule, MatRadioModule } from '@angular/material';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreenchimentoFormularioComponent } from './preenchimento-formulario.component';
import { PreenchimentoFormularioSecaoComponent } from '../preenchimento-formulario-secao/preenchimento-formulario-secao.component';
import { NotEmptyValidatorModule } from 'src/app/components/not-empty-validator/not-empty-validator.module';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [PreenchimentoFormularioComponent, PreenchimentoFormularioSecaoComponent],
  imports: [
    PreenchimentoFormularioRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
    NgxSummernoteModule,
    DatepickerPCSModule,
    MatTreeModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    StripTagsModule,
    HasRoleModule,
    NotEmptyValidatorModule,
    NgxCaptchaModule,
  ]
})
export class PreenchimentoFormularioModule { }
