import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAtendimentoComponent } from './formulario-atendimento.component';

describe('FormularioAtendimentoComponent', () => {
  let component: FormularioAtendimentoComponent;
  let fixture: ComponentFixture<FormularioAtendimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioAtendimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
