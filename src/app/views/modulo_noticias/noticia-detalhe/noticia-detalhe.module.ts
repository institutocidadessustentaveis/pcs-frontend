import { CardEventoModule } from './../../modulo_eventos/card-evento/card-evento.module';
import { ShareModule } from '@ngx-share/core';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticiaDetalheRoutingModule } from './noticia-detalhe-routing.module';
import { NoticiaDetalheComponent } from './noticia-detalhe.component';
import { MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { TempoPercorridoModule } from 'src/app/components/tempo-percorrido/tempo-percorrido.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [NoticiaDetalheComponent],
  imports: [
    CommonModule,
    NoticiaDetalheRoutingModule,
    NgxSummernoteModule,
    MatProgressSpinnerModule,
    BreadcrumbModule,
    TempoPercorridoModule,
    AngularFontAwesomeModule,
    ShareModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class NoticiaDetalheModule { }
