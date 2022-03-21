import { MatCardModule, MatDividerModule, MatPaginatorModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, MatSortModule, MatListModule, MatDialogModule, MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatStepperModule, MatDatepickerModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HasRoleModule } from 'src/app/components/has-role/has-role.module';
import { MaterialApoioListComponent } from './material-apoio-list/material-apoio-list.component';
import { MaterialApoioFormComponent } from './material-apoio-form/material-apoio-form.component';
import { MaterialApoioRoutingModule } from './material-apoio-routing.module';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxGalleryModule } from 'ngx-gallery';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BreadcrumbModule2 } from 'src/app/components/breadcrumb2/breadcrumb.module2';

@NgModule({
  declarations: [ MaterialApoioListComponent, MaterialApoioFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialApoioRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    NgxMaskModule.forRoot(),
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgxSummernoteModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ShareModule,
    AngularFontAwesomeModule,
    NgxGalleryModule,
    MatTooltipModule,
    LeafletModule.forRoot()
  ]
})
export class MaterialApoioModule { }
