import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuariosComponent } from './registro-usuarios.component';

describe('AtividadeUsuarioComponent', () => {
  let component: RegistroUsuariosComponent;
  let fixture: ComponentFixture<RegistroUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
