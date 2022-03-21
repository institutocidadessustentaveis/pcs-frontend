import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AjustesGeraisComponent } from './ajustes-gerais.component';
import { AjustesGeraisRoutingModule } from './ajustes-gerais-routing.module';
import { MatButtonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [AjustesGeraisComponent],
  imports: [
    AjustesGeraisRoutingModule,
    CommonModule,
    MatTabsModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
    NgxSummernoteModule,
    MatTableModule
  ]
})
export class AjustesGeraisModule { }
