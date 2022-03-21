import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripTagsPipe } from './strip-tags.pipe';

@NgModule({
  declarations: [StripTagsPipe],
  imports: [
    CommonModule
  ],
  exports: [StripTagsPipe]
})
export class StripTagsModule { }
