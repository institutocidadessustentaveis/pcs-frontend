import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioFormComponent } from './formulario-form.component';

describe('FormularioFormComponent', () => {
  let component: FormularioFormComponent;
  let fixture: ComponentFixture<FormularioFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
