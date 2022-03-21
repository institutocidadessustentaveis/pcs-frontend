import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracaoAtendimentoRoutingModule } from './administracao-atendimento-routing.module';
import { AdministracaoAtendimentoComponent } from './administracao-atendimento.component';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalSolicitacaoComponent } from './modal-solicitacao/modal-solicitacao.component';

@NgModule({
  declarations: [AdministracaoAtendimentoComponent, ModalSolicitacaoComponent],
  imports: [
    CommonModule,
    AdministracaoAtendimentoRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule
  ],
  entryComponents: [ModalSolicitacaoComponent]
})
export class AdministracaoAtendimentoModule { }
