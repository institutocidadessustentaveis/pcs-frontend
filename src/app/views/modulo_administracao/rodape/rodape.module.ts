import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RodapeRoutingModule } from './rodape-routing.module';
import { RodapeComponent } from './rodape.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule, MatButtonModule, 
          MatDialogModule, MatOptionModule, 
          MatInputModule, MatProgressBarModule,
          MatIconModule, MatFormFieldModule, 
          MatTableModule, MatCheckboxModule, 
          MatTabsModule, 
          MatSelectModule} from '@angular/material';

@NgModule({
  declarations: [RodapeComponent],
  imports: [
    CommonModule,
    RodapeRoutingModule,
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
    MatSelectModule,
  ]
})
export class RodapeModule { }
