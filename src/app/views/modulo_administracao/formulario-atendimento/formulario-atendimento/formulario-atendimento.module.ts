import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioAtendimentoRoutingModule } from './formulario-atendimento-routing.module';
import { FormularioAtendimentoComponent } from './formulario-atendimento.component';
import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormularioAtendimentoComponent],
  imports: [
    CommonModule,
    FormularioAtendimentoRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class FormularioAtendimentoModule { }
