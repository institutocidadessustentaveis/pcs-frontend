import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoMetasPrestacaoContasComponent } from './plano-metas-prestacao-contas.component';

describe('PlanoMetasPrestacaoContasComponent', () => {
  let component: PlanoMetasPrestacaoContasComponent;
  let fixture: ComponentFixture<PlanoMetasPrestacaoContasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoMetasPrestacaoContasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoMetasPrestacaoContasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
