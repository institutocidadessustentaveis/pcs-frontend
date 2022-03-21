import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorReferenciaPipe } from './cor-referencia-pipe.pipe';

@NgModule({
  declarations: [CorReferenciaPipe],
  imports: [
    CommonModule
  ],
  exports: [CorReferenciaPipe]
})
export class CorReferenciaPipeModule { }
