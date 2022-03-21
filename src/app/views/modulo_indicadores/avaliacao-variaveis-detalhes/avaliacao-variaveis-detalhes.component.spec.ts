import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoVariaveisDetalhes } from './avaliacao-variaveis-detalhes.component';

describe('TesteComponent', () => {
  let component: AvaliacaoVariaveisDetalhes;
  let fixture: ComponentFixture<AvaliacaoVariaveisDetalhes>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoVariaveisDetalhes ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoVariaveisDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
