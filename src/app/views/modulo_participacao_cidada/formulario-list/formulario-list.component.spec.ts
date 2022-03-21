import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioListComponent } from './formulario-list.component';

describe('FormularioListComponent', () => {
  let component: FormularioListComponent;
  let fixture: ComponentFixture<FormularioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
