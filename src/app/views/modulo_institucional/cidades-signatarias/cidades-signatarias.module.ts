import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { MatCardModule, MatDividerModule, 
          MatFormFieldModule, MatIconModule, 
          MatProgressBarModule, MatInputModule, 
          MatButtonModule, MatOptionModule, 
          MatSelectModule, MatListModule, 
          MatTableModule, MatCheckboxModule, 
          MatPaginatorModule, MatSortModule, 
          MatExpansionModule, MatChipsModule, 
          MatSlideToggleModule, MatTooltipModule, MatTabsModule  } from '@angular/material';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { CidadesSignatariasRoutingModule } from './cidades-signatarias-routing.module';
import { CidadesSignatariasComponent } from './cidades-signatarias.component';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { HistoricoCidadesSignatariasModule } from '../historico-cidades-signatarias/historico-cidades-signatarias.module';
import { BoasPraticasCidadesSignatariasModule } from '../boas-praticas-cidades-signatarias/boas-praticas-cidades-signatarias.module';

@NgModule({
  declarations: [CidadesSignatariasComponent],
  imports: [
    CommonModule,
    FormsModule,
    CidadesSignatariasRoutingModule,
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    LeafletModule.forRoot(),
    ScrollToModule.forRoot(),
    LeafletMarkerClusterModule.forRoot(),
    BreadcrumbModule,
    HistoricoCidadesSignatariasModule,
    BoasPraticasCidadesSignatariasModule
  ]
})
export class CidadesSignatariasModule { }
