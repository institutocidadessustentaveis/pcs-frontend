import { ControlValueAccessor, ControlContainer, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { Component, OnInit,  AfterViewInit , Input, Optional, Host, SkipSelf, forwardRef } from '@angular/core';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
  }]
})
export class DatepickerComponent implements ControlValueAccessor, OnInit  {

  @Input() placeholder: string;
  @Input() type = 'date';
  @Input() class = 'col-lg-12';
  @Input() style = '';
  @Input() formControlName: string;
  @Input() hidden: boolean = false;
  @Input() required: boolean = false;
  public control: AbstractControl;
  inicializado = false;

  writeValue(obj: any): void {
    if (this.control) {
      //this.control.value = (obj);
    }
  }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }

  constructor(@Optional() @Host() @SkipSelf()  private controlContainer: ControlContainer) { }

  ngOnInit () {
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control.get(this.formControlName);
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn('Can\'t find parent FormGroup directive');
    }
    this.inicializado = true;

  }


}
