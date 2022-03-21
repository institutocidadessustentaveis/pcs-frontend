import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaEventosComponent } from './mapa-eventos.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [MapaEventosComponent],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [MapaEventosComponent]
})
export class MapaEventosModule { }
