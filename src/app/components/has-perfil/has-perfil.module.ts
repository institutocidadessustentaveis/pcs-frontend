import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasPerfilPipe } from './has-perfil.pipe';

@NgModule({
  declarations: [HasPerfilPipe],
  imports: [
    CommonModule
  ],
  exports: [HasPerfilPipe]
})
export class HasPerfilModule { }
