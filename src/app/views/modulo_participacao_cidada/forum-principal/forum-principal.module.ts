import { ShareModule } from '@ngx-share/core';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { ForumPrincipalRoutingModule } from './forum-principal-routing.module';
import { ForumPrincipalComponent } from './forum-principal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatTooltipModule, MatRadioButton, MatRadioModule, MatDialogModule, MatTableModule, MatProgressBarModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { ForumCadastroDiscussaoComponent } from '../forum-cadastro-discussao/forum-cadastro-discussao.component';

@NgModule({
  declarations: [
    ForumPrincipalComponent,
    ForumCadastroDiscussaoComponent,
  ],
  imports: [
    CommonModule,
    ForumPrincipalRoutingModule,
    BreadcrumbModule,
    ShareModule,
    MatProgressSpinnerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    NgxSummernoteModule,
    DatepickerPCSModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
    MatRadioModule,
    MatDialogModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule
  ]
})
export class ForumPrincipalModule { }
