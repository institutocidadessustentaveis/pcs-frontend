import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesAcademicasPrincipalComponent } from './contribuicoes-academicas-principal.component';

describe('ContribuicoesAcademicasPrincipalComponent', () => {
  let component: ContribuicoesAcademicasPrincipalComponent;
  let fixture: ComponentFixture<ContribuicoesAcademicasPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesAcademicasPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesAcademicasPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
