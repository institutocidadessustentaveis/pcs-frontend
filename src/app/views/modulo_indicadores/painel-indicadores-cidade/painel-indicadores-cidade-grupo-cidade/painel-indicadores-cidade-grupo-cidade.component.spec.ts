import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelIndicadoresCidadeGrupoCidadeComponent } from './painel-indicadores-cidade-grupo-cidade.component';

describe('PainelIndicadoresCidadeGrupoCidadeComponent', () => {
  let component: PainelIndicadoresCidadeGrupoCidadeComponent;
  let fixture: ComponentFixture<PainelIndicadoresCidadeGrupoCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelIndicadoresCidadeGrupoCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelIndicadoresCidadeGrupoCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
