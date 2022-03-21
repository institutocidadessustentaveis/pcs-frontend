import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelIndicadoresCidadeDetalhesComponent } from './painel-indicadores-cidade-detalhes.component';

describe('PainelIndicadoresCidadeDetalhesComponent', () => {
  let component: PainelIndicadoresCidadeDetalhesComponent;
  let fixture: ComponentFixture<PainelIndicadoresCidadeDetalhesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelIndicadoresCidadeDetalhesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelIndicadoresCidadeDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
