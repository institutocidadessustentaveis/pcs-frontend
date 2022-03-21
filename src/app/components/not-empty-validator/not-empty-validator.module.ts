import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotEmptyValidatorDirective } from './not-empty-validator.service';

@NgModule({
  declarations: [NotEmptyValidatorDirective],
  imports: [
    CommonModule
  ],
  exports: [NotEmptyValidatorDirective]
})
export class NotEmptyValidatorModule { }
