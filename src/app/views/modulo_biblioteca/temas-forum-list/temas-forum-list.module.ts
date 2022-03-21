import { TemasForumFormComponent } from './../temas-forum-form/temas-forum-form.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TemasForumListRoutingModule } from './temas-forum-list-routing.module';
import { TemasForumListComponent } from './temas-forum-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule  } from '@angular/material';

@NgModule({
  declarations: [
    TemasForumListComponent,
    TemasForumFormComponent
  ],
  imports: [
    CommonModule,
    TemasForumListRoutingModule,
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
export class TemasForumListModule { }
