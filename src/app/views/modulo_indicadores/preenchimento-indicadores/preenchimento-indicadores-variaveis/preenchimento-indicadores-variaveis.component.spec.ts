import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreenchimentoIndicadoresVariaveisComponent } from './preenchimento-indicadores-variaveis.component';

describe('PreenchimentoIndicadoresVariaveisComponent', () => {
  let component: PreenchimentoIndicadoresVariaveisComponent;
  let fixture: ComponentFixture<PreenchimentoIndicadoresVariaveisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreenchimentoIndicadoresVariaveisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreenchimentoIndicadoresVariaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
