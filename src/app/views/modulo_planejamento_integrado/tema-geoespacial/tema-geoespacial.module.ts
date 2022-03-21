import { MatCardModule, MatDividerModule, MatPaginatorModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemaGeoespacialRoutingModule } from './tema-geoespacial-routing.module';
import { TemaGeoespacialListComponent } from './tema-geoespacial-list/tema-geoespacial-list.component';
import { TemaGeoespacialFormComponent } from './tema-geoespacial-form/tema-geoespacial-form.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HasRoleModule } from 'src/app/components/has-role/has-role.module';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [ TemaGeoespacialListComponent, TemaGeoespacialFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TemaGeoespacialRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    HasRoleModule,
    TextFieldModule
  ]
})
export class TemaGeoespacialModule { }
