import { ExistPipePipe } from './exist-pipe.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ExistPipePipe],
  imports: [
    CommonModule
  ],
  exports: [ExistPipePipe]
})
export class ExistPipeModule { }
