import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoIntegradoInicialComponent } from './planejamento-integrado-inicial.component';

describe('BoasPraticasInicialComponent', () => {
  let component: PlanejamentoIntegradoInicialComponent;
  let fixture: ComponentFixture<PlanejamentoIntegradoInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanejamentoIntegradoInicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanejamentoIntegradoInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
