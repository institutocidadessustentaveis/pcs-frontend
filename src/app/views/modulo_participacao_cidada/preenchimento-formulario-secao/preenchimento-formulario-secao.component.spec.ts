import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreenchimentoFormularioSecaoComponent } from './preenchimento-formulario-secao.component';

describe('PreenchimentoFormularioSecaoComponent', () => {
  let component: PreenchimentoFormularioSecaoComponent;
  let fixture: ComponentFixture<PreenchimentoFormularioSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreenchimentoFormularioSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreenchimentoFormularioSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
