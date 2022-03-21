import { SlugifyPipe } from './slugify.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SlugifyPipe],
  exports:[SlugifyPipe]
})
export class SlugifyModule { }
