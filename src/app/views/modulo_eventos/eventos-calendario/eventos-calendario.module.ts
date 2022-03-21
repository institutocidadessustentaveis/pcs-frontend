
import { CustomEventTitleFormatter } from './CustomEventTitleFormatter.component';
import { MatCardModule, MatDividerModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import {MatTableModule} from '@angular/material/table';
import { EventosCalendarioComponent } from './eventos-calendario.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter, CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';



@NgModule({
  declarations: [ 
    EventosCalendarioComponent
  ],
   providers: [{
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
     }],
  imports: [
    CommonModule,
    BreadcrumbModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,      
    MatIconModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DadosDownloadModule
  ],
  exports: [
    EventosCalendarioComponent
  ],
  
  
})
export class EventosCalendarioModule { }



