import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaAdministracaoComponent } from './biblioteca-administracao.component';

describe('BibliotecaAdministracaoComponent', () => {
  let component: BibliotecaAdministracaoComponent;
  let fixture: ComponentFixture<BibliotecaAdministracaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliotecaAdministracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecaAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
