import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoLeisRegulamentacaoComponent } from './plano-leis-regulamentacao.component';

describe('PlanoLeisRegulamentacaoComponent', () => {
  let component: PlanoLeisRegulamentacaoComponent;
  let fixture: ComponentFixture<PlanoLeisRegulamentacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoLeisRegulamentacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoLeisRegulamentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
