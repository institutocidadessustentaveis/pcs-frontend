import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatDividerModule, MatFormFieldModule, MatProgressBarModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatListModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatPaginator } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InstitucionalDinamicoListComponent } from './institucional-dinamico-list.component';
import { InstitucionalDinamicoListRoutingModule } from './institucional-dinamico-list-routing.module';


@NgModule({
  declarations: [
    InstitucionalDinamicoListComponent],
  imports: [
    CommonModule,
    InstitucionalDinamicoListRoutingModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    NgxSummernoteModule,
    AngularFontAwesomeModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatSortModule
  ],
})
export class InstitucionalDinamicoListModule { }
