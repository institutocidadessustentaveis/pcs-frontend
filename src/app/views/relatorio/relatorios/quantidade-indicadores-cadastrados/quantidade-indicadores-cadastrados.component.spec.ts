import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantidadeIndicadoresCadastradosComponent } from './quantidade-indicadores-cadastrados.component';

describe('QuantidadeIndicadoresCadastradosComponent', () => {
  let component: QuantidadeIndicadoresCadastradosComponent;
  let fixture: ComponentFixture<QuantidadeIndicadoresCadastradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantidadeIndicadoresCadastradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantidadeIndicadoresCadastradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
