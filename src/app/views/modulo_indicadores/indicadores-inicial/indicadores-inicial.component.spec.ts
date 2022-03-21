import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresInicialComponent } from './indicadores-inicial.component';

describe('IndicadoresInicialComponent', () => {
  let component: IndicadoresInicialComponent;
  let fixture: ComponentFixture<IndicadoresInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresInicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
