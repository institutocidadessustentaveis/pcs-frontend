import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TempoPercorridoPipe } from './tempo-percorrido.pipe';

@NgModule({
  declarations: [TempoPercorridoPipe],
  imports: [
    CommonModule
  ],
  exports:[
    TempoPercorridoPipe
  ]
})
export class TempoPercorridoModule { }
