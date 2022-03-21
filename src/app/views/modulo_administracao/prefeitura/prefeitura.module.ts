import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { PrefeituraRoutingModule } from './prefeitura-routing.module';
import { PrefeituraComponent } from './prefeitura.component';
import { PrefeituraFormComponent, DialogTermos } from '../prefeitura-form/prefeitura-form.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [PrefeituraComponent, PrefeituraFormComponent,DialogTermos],
  imports: [
    CommonModule,
    PrefeituraRoutingModule,
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
    NgxMaskModule.forRoot(),
  ],
  entryComponents: [DialogTermos],
})
export class PrefeituraModule { }
