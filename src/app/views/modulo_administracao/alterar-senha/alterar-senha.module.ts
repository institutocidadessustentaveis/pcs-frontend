import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlterarSenhaRoutingModule } from './alterar-senha-routing.module';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule,
  MatInputModule, MatButtonModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AlterarSenhaComponent } from './alterar-senha.component';

@NgModule({
  declarations: [AlterarSenhaComponent],
  imports: [
    CommonModule,
    AlterarSenhaRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
  ]
})
export class AlterarSenhaModule { }
