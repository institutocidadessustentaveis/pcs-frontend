import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioConteudoCompartilhadoComponent } from './relatorio-conteudo-compartilhado.component';

describe('RelatorioConteudoCompartilhadoComponent', () => {
  let component: RelatorioConteudoCompartilhadoComponent;
  let fixture: ComponentFixture<RelatorioConteudoCompartilhadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioConteudoCompartilhadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioConteudoCompartilhadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
