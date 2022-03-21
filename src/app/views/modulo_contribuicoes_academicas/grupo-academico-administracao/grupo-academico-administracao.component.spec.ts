import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoAcademicoAdministracaoComponent } from './grupo-academico-administracao.component';

describe('GrupoAcademicoComponent', () => {
  let component: GrupoAcademicoComponent;
  let fixture: ComponentFixture<GrupoAcademicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoAcademicoAdministracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoAcademicoAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
