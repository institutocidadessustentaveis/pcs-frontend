import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioListComponent } from './formulario-list.component';
import { FormularioListRoutingModule } from './formulario-list-routing.module';
import { MatCardModule, MatIconModule, MatDividerModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatDatepickerModule, MatListModule, MatExpansionModule, MatTooltipModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { FormularioFormComponent } from '../formulario-form/formulario-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import {MatTreeModule} from '@angular/material/tree';
import { StripTagsModule } from 'src/app/components/strip-tags/strip-tags.module';
import { HasRoleModule } from 'src/app/components/has-role/has-role.module';

@NgModule({
  declarations: [FormularioListComponent, FormularioFormComponent],
  imports: [
    CommonModule,
    FormularioListRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
    NgxSummernoteModule,
    DatepickerPCSModule,
    MatTreeModule,
    MatExpansionModule,
    StripTagsModule,
    HasRoleModule,
    MatTooltipModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class FormularioListModule { }
