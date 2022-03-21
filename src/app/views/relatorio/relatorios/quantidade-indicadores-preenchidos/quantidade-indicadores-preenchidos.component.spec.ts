import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantidadeIndicadoresPreenchidosComponent } from './quantidade-indicadores-preenchidos.component';

describe('QuantidadeIndicadoresPreenchidosComponent', () => {
  let component: QuantidadeIndicadoresPreenchidosComponent;
  let fixture: ComponentFixture<QuantidadeIndicadoresPreenchidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantidadeIndicadoresPreenchidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantidadeIndicadoresPreenchidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
