import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricoShapesRoutingModule } from './historico-shapes-routing.module';
import { HistoricoShapesComponent } from './historico-shapes.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { MatCardModule, MatFormFieldModule, MatDividerModule, MatDatepickerModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatProgressBarModule, MatIconModule, MatSortModule, MatTableModule, MatTooltipModule, MatTabsModule, MatChipsModule, MatOptionModule, MatListModule, MatSlideToggleModule, MatCheckboxModule } from '@angular/material';
import { MatMomentDateModule } from '@coachcare/datepicker';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HistoricoShapesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HistoricoShapesRoutingModule,
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
export class HistoricoShapesModule { }
