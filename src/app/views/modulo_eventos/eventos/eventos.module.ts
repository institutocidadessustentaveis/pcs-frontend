import { MatCardModule, MatDividerModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatTooltipModule, MatInputModule, MatSortModule } from '@angular/material';
import { EventosRoutingModule } from './eventos-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosComponent } from './eventos.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import {MatTableModule} from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';


@NgModule({
  declarations: [EventosComponent],
  imports: [
    EventosRoutingModule,
    CommonModule,
    MatSortModule,
    BreadcrumbModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DatepickerPCSModule,
    MatButtonModule
  ]
})
export class EventosModule { }
