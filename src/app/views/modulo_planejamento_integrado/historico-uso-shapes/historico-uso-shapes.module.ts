import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricoUsoShapesRoutingModule } from './historico-uso-shapes-routing.module';
import { HistoricoUsoShapesComponent } from './historico-uso-shapes.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { MatCardModule, MatFormFieldModule, MatDividerModule, 
          MatDatepickerModule, MatSelectModule, MatExpansionModule, 
          MatPaginatorModule, MatButtonModule, MatInputModule, 
          MatProgressBarModule, MatIconModule, MatSortModule, 
          MatTableModule, MatTooltipModule, MatTabsModule, 
          MatChipsModule, MatOptionModule, MatListModule, 
          MatSlideToggleModule, MatCheckboxModule } from '@angular/material';
import { MatMomentDateModule } from '@coachcare/datepicker';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

@NgModule({
  declarations: [HistoricoUsoShapesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HistoricoUsoShapesRoutingModule,
    BreadcrumbModule,
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
    MatDatepickerModule,
    MatMomentDateModule,
    DatepickerPCSModule,
  ]
})
export class HistoricoUsoShapesModule { }
