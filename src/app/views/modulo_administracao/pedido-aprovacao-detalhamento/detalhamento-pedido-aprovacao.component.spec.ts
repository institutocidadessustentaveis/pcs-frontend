import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhamentoPedidoAprovacaoComponent } from './detalhamento-pedido-aprovacao.component';

describe('DetalhamentoPedidoAprovacaoComponent', () => {
  let component: DetalhamentoPedidoAprovacaoComponent;
  let fixture: ComponentFixture<DetalhamentoPedidoAprovacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhamentoPedidoAprovacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhamentoPedidoAprovacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
