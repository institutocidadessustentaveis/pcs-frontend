import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoAcademicoFormComponent } from './grupo-academico-form.component';

describe('GrupoAcademicoFormComponent', () => {
  let component: GrupoAcademicoFormComponent;
  let fixture: ComponentFixture<GrupoAcademicoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoAcademicoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoAcademicoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
