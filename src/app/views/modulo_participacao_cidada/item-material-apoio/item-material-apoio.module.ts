import { ItemMaterialApoioComponent } from './item-material-apoio.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatButtonModule, MatInputModule, MatDialogModule, MatFormFieldModule, MatAutocompleteModule, MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [ItemMaterialApoioComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatRadioModule,
    DadosDownloadModule
  ],
  exports: [ItemMaterialApoioComponent]
})
export class ItemMaterialApoioModule { }
