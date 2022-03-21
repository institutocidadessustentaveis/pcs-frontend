import { KeysPipe } from './keys-pipe.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [KeysPipe],
  imports: [
    CommonModule
  ],
  exports: [KeysPipe]
})
export class KeysPipeModule { }
