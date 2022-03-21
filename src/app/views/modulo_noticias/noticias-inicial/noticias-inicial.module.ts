import { BreadcrumbModule2 } from './../../../components/breadcrumb2/breadcrumb.module2';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule,
  MatTooltipModule, MatTabsModule  } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NoticiasInicialRoutingModule } from './noticias-inicial-routing.module';
import { NoticiasInicialComponent } from './noticias-inicial.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [NoticiasInicialComponent],
  imports: [
    CommonModule,
    NoticiasInicialRoutingModule,
    ReactiveFormsModule,
    FormsModule,
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
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    BreadcrumbModule2,
    MatSlideToggleModule
  ]
})
export class NoticiasInicialModule { }
