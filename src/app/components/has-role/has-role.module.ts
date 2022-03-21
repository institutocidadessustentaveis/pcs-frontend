import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRolePipe } from './has-role.pipe';

@NgModule({
  declarations: [	HasRolePipe ],
  imports: [
    CommonModule
  ],
  exports: [HasRolePipe]
})
export class HasRoleModule { }
