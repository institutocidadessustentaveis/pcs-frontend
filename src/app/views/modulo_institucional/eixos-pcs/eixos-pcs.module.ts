import { BreadcrumbModule } from '../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
         MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
         MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
         MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatTabsModule  } from '@angular/material';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { EixosPcsRoutingModule } from './eixos-pcs-routing.module';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { EixosPcsComponent } from './eixos-pcs.component';

@NgModule({
  declarations: [EixosPcsComponent],
  imports: [
    CommonModule,
    FormsModule,
    EixosPcsRoutingModule,
    MatCardModule,
    MatDividerModule,
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
    BreadcrumbModule
  ]
})
export class EixosPcsModule { }
