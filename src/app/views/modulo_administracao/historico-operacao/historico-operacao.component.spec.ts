import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoOperacaoComponent } from './historico-operacao.component';

describe('HistoricoOperacaoComponent', () => {
  let component: HistoricoOperacaoComponent;
  let fixture: ComponentFixture<HistoricoOperacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoOperacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoOperacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
