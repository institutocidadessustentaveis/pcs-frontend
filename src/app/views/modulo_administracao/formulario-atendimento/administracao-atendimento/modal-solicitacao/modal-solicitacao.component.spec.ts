import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitacaoComponent } from './modal-solicitacao.component';

describe('ModalSolicitacaoComponent', () => {
  let component: ModalSolicitacaoComponent;
  let fixture: ComponentFixture<ModalSolicitacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSolicitacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
