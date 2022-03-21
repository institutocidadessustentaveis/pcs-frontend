import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracaoAtendimentoComponent } from './administracao-atendimento.component';

describe('AdministracaoAtendimentoComponent', () => {
  let component: AdministracaoAtendimentoComponent;
  let fixture: ComponentFixture<AdministracaoAtendimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracaoAtendimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
