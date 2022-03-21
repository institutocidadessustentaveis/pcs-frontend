import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent } from './comparacao-mesma-cidade-grupo-cidade.component';

describe('PainelIndicadoresCidadeGrupoCidadeComponent', () => {
  let component: CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent;
  let fixture: ComponentFixture<CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararIndicadoresDiferentesMesmaCidadeGrupoCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
