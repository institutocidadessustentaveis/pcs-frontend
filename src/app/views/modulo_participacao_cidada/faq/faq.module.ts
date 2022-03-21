import { CardFaqModule } from './../faq/card_faq/card-faq.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule,
  MatTooltipModule, MatTabsModule  } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule2 } from 'src/app/components/breadcrumb2/breadcrumb.module2';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    MatCardModule,
    MatInputModule,
    CardFaqModule,
    MatFormFieldModule,
    BreadcrumbModule2,
    MatExpansionModule,
    MatIconModule,
    NgxSummernoteModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
  ]
})
export class FaqModule { }
