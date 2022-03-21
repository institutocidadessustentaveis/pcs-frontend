import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[notEmptyValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NotEmptyValidatorDirective,
    multi: true
  }]
})
export class NotEmptyValidatorDirective implements Validator {
  validate(control: AbstractControl) : {[key: string]: any} | null {
    if (control.value && control.value.length == 0) {
      return { 'isEmpty': true }; // return object if the validation is not passed.
    }
    return null; // return null if validation is passed.
  }
}
