import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosFormComponent } from './eventos-form.component';
import { EventosFormRoutingModule } from './eventos-form-routing.module';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule, MatIconModule, MatTooltipModule, MatListModule, MatProgressBarModule, MatAutocompleteModule, MatDialogModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [EventosFormComponent],
  imports: [
    CommonModule,
    EventosFormRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    NgxSummernoteModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    MatListModule,
    MatDialogModule,
    LeafletModule.forRoot()
  ]
})
export class EventosFormModule { }
//
