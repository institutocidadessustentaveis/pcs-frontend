import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent } from './comparacao-mesma-cidade-detalhes.component';

describe('CompararIndicadoresMesmaCidadeDetalhesComponent', () => {
  let component: CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent;
  let fixture: ComponentFixture<CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
