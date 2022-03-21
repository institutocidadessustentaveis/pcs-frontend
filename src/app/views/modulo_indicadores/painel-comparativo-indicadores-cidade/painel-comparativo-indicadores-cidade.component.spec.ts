import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelComparativoIndicadoresCidadeComponent } from './painel-comparativo-indicadores-cidade.component';

describe('PainelIndicadoresCidadeComponent', () => {
  let component: PainelComparativoIndicadoresCidadeComponent;
  let fixture: ComponentFixture<PainelComparativoIndicadoresCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelComparativoIndicadoresCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelComparativoIndicadoresCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
