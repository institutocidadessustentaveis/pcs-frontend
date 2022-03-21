import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatInputModule, MatIconModule, MatButtonModule } from '@angular/material';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { ConfiguracaoComentarioRoutingModule } from './configuracao-comentario-routing.module';
import { ConfiguracaoComentarioComponent } from './configuracao-comentario.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfiguracaoComentarioComponent],
  imports: [
    CommonModule,
    ConfiguracaoComentarioRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class ConfiguracaoComentarioModule { }
