import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ForumDiscussoesRoutingModule } from './forum-discussoes-routing.module';
import { ForumDiscussoesComponent } from './forum-discussoes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule  } from '@angular/material';

@NgModule({
  declarations: [ForumDiscussoesComponent],
  imports: [
    CommonModule,
    ForumDiscussoesRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    BreadcrumbModule,
    AngularFontAwesomeModule,
    MatTooltipModule,
    ImageCropperModule
  ]
})
export class ForumDiscussoesModule { }
