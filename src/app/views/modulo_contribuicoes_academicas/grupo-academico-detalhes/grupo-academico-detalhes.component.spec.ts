import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoAcademicoDetalhesComponent } from './grupo-academico-detalhes.component';

describe('GrupoAcademicoDetalhesComponent', () => {
  let component: GrupoAcademicoDetalhesComponent;
  let fixture: ComponentFixture<GrupoAcademicoDetalhesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoAcademicoDetalhesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoAcademicoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
