import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreenchimentoFormularioComponent } from './preenchimento-formulario.component';

describe('PreenchimentoFormularioComponent', () => {
  let component: PreenchimentoFormularioComponent;
  let fixture: ComponentFixture<PreenchimentoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreenchimentoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreenchimentoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
