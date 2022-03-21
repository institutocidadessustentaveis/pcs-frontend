import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresParaPreencherComponent } from './indicadores-para-preencher.component';

describe('IndicadoresParaPreencherComponent', () => {
  let component: IndicadoresParaPreencherComponent;
  let fixture: ComponentFixture<IndicadoresParaPreencherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresParaPreencherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresParaPreencherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
