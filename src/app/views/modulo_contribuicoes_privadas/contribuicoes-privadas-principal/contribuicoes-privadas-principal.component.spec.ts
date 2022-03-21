import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesPrivadasPrincipalComponent } from './contribuicoes-privadas-principal.component';

describe('ContribuicoesPrivadasPrincipalComponent', () => {
  let component: ContribuicoesPrivadasPrincipalComponent;
  let fixture: ComponentFixture<ContribuicoesPrivadasPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesPrivadasPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesPrivadasPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
