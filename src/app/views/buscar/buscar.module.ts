import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuscarRoutingModule } from './buscar-routing.module';
import { BuscarComponent } from './buscar.component';

import { MatCardModule, MatDividerModule, MatIconModule,
         MatProgressBarModule, MatProgressSpinnerModule,
         MatInputModule, MatPaginatorModule, MatButtonModule,
         MatFormFieldModule, MatOptionModule, MatChipsModule,
         MatListModule,
         MatGridListModule,
         MatDatepickerModule} from '@angular/material';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

@NgModule({
  declarations: [BuscarComponent],
  imports: [
    CommonModule,
    BuscarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatChipsModule,
    MatOptionModule,
    MatListModule,
    MatGridListModule,
    DatepickerPCSModule,
    MatDatepickerModule,
    BreadcrumbModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class BuscarModule { }
