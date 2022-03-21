import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraFormulaComponent } from './calculadora-formula.component';

describe('CalculadoraFormulaComponent', () => {
  let component: CalculadoraFormulaComponent;
  let fixture: ComponentFixture<CalculadoraFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculadoraFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculadoraFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
