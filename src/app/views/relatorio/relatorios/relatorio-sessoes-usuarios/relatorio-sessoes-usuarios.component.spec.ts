import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioSessoesUsuariosComponent } from './relatorio-sessoes-usuarios.component';

describe('RelatorioSessoesUsuariosComponent', () => {
  let component: RelatorioSessoesUsuariosComponent;
  let fixture: ComponentFixture<RelatorioSessoesUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioSessoesUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioSessoesUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
