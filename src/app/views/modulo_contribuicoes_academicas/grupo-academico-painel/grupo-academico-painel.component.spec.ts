import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoAcademicoPainelComponent } from './grupo-academico-painel.component';

describe('GrupoAcademicoPainelComponent', () => {
  let component: GrupoAcademicoPainelComponent;
  let fixture: ComponentFixture<GrupoAcademicoPainelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoAcademicoPainelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoAcademicoPainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
