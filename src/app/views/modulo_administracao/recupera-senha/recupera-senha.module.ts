import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatProgressSpinnerModule,
  MatPaginatorModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecuperaSenhaRoutingModule } from './recupera-senha-routing.module';
import { RecuperaSenhaComponent } from './recupera-senha.component';

@NgModule({
  declarations: [RecuperaSenhaComponent],
  imports: [
    CommonModule,
    RecuperaSenhaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class RecuperaSenhaModule { }
