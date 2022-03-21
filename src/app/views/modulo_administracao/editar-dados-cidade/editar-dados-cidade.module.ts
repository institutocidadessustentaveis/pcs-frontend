import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { EditarDadosCidadeRoutingModule } from './editar-dados-cidade-routing.module';
import { EditarDadosCidadeComponent } from './editar-dados-cidade.component';

@NgModule({
  declarations: [EditarDadosCidadeComponent],
  imports: [
    CommonModule,
    EditarDadosCidadeRoutingModule,
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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot()
  ]
})
export class EditarDadosCidadeModule { }
