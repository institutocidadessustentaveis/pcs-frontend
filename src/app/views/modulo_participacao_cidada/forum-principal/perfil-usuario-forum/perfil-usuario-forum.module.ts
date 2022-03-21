import { PerfilUsuarioForumComponent } from './perfil-usuario-forum.component';
import { ShareModule } from '@ngx-share/core';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatCardModule, MatIconModule, MatInputModule, MatButtonModule } from '@angular/material';
import { PerfilUsuarioForumRoutingModule } from './perfil-usuario-forum-routing.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PerfilUsuarioForumComponent],
  imports: [
    CommonModule,
    PerfilUsuarioForumRoutingModule,
    BreadcrumbModule,
    ShareModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule

  ]
})
export class PerfilUsuarioForumModule { }
