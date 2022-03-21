import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoasPraticasInicialComponent } from './boas-praticas-inicial.component';

describe('BoasPraticasInicialComponent', () => {
  let component: BoasPraticasInicialComponent;
  let fixture: ComponentFixture<BoasPraticasInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoasPraticasInicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoasPraticasInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
