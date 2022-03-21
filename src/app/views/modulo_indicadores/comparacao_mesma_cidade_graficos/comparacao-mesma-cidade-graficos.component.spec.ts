import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararIndicadoresDiferentesMesmaCidadeGraficosComponent } from './comparacao-mesma-cidade-graficos.component';

describe('IndicadoresDetalhesComponent', () => {
  let component: CompararIndicadoresDiferentesMesmaCidadeGraficosComponent;
  let fixture: ComponentFixture<CompararIndicadoresDiferentesMesmaCidadeGraficosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompararIndicadoresDiferentesMesmaCidadeGraficosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararIndicadoresDiferentesMesmaCidadeGraficosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
