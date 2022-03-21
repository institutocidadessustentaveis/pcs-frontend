import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelIndicadoresCidadeGrupoIndicadoresComponent } from './painel-indicadores-cidade-grupo-indicadores.component';

describe('PainelIndicadoresCidadeGrupoIndicadoresComponent', () => {
  let component: PainelIndicadoresCidadeGrupoIndicadoresComponent;
  let fixture: ComponentFixture<PainelIndicadoresCidadeGrupoIndicadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelIndicadoresCidadeGrupoIndicadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelIndicadoresCidadeGrupoIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
