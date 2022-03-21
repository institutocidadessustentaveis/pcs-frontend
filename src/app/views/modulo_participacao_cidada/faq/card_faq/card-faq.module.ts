import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFaqComponent } from './card-faq.component';
import { CardFaqRoutingModule } from './card-faq-routing.module';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
    MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
    MatCheckboxModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule,
    MatTooltipModule, MatTabsModule  } from '@angular/material';

@NgModule({
  declarations: [CardFaqComponent],
  imports: [
    CommonModule,
    CardFaqRoutingModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule
  ],
  exports: [
      CardFaqComponent
  ]
})
export class CardFaqModule { }
