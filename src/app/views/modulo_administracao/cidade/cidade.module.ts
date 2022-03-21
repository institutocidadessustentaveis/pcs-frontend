import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CidadeRoutingModule } from './cidade-routing.module';
import { CidadeComponent } from './cidade.component';
import { CidadeFormComponent } from '../cidade-form/cidade-form.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PontoFocalDetalhesModule } from './ponto-focal-detalhes/ponto-focal-detalhes.module';

@NgModule({
  declarations: [CidadeComponent,CidadeFormComponent],
  imports: [
    CommonModule,
    CidadeRoutingModule,
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
    BreadcrumbModule,
    MatTooltipModule,
    PontoFocalDetalhesModule
  ]
})
export class CidadeModule { }
