import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreenchimentoIndicadoresResultadoComponent } from './preenchimento-indicadores-resultado.component';

describe('PreenchimentoIndicadoresResultadoComponent', () => {
  let component: PreenchimentoIndicadoresResultadoComponent;
  let fixture: ComponentFixture<PreenchimentoIndicadoresResultadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreenchimentoIndicadoresResultadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreenchimentoIndicadoresResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
