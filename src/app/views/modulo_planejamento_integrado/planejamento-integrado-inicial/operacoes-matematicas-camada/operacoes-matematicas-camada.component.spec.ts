import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacoesMatematicasCamadaComponent } from './operacoes-matematicas-camada.component';

describe('OperacoesMatematicasCamadaComponent', () => {
  let component: OperacoesMatematicasCamadaComponent;
  let fixture: ComponentFixture<OperacoesMatematicasCamadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperacoesMatematicasCamadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacoesMatematicasCamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
