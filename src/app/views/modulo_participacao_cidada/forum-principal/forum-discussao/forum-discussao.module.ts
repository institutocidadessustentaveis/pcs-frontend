import { ShareModule } from '@ngx-share/core';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatCardModule, MatIconModule, MatInputModule, MatButtonModule, MatMenuModule, MatProgressSpinner, MatDividerModule, MatTooltipModule } from '@angular/material';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ForumDiscussaoRoutingModule } from './forum-discussao-routing.module';
import { ForumDiscussaoComponent } from './forum-discussao.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ComentariosFilhosComponent } from './comentarios-filhos/comentarios-filhos.component';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [ForumDiscussaoComponent, ComentariosFilhosComponent],
  imports: [
    CommonModule,
    ForumDiscussaoRoutingModule,
    BreadcrumbModule,
    ShareModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxSummernoteModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ScrollToModule.forRoot(),
    MatDividerModule,
    MatTooltipModule,
    NgxMaskModule
  ]
})
export class ForumDiscussaoModule { }
