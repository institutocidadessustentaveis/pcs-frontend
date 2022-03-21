import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule, MatButtonModule, 
          MatDialogModule, MatOptionModule, 
          MatInputModule, MatProgressBarModule,
          MatIconModule, MatFormFieldModule, 
          MatTableModule, MatCheckboxModule, 
          MatTabsModule, MatTreeModule, MatSelectModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTreeModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule
  ]
})
export class MenuModule { }
