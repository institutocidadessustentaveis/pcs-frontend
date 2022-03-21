import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CadSenhaPrefeituraRoutingModule } from './cad-senha-prefeitura-routing.module';
import { CadSenhaPrefeituraComponent } from './cad-senha-prefeitura.component';

@NgModule({
  declarations: [CadSenhaPrefeituraComponent],
  imports: [
    CommonModule,
    CadSenhaPrefeituraRoutingModule,
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
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,

  ]
})
export class CadSenhaPrefeituraModule { }
