import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSugestaoBoasPraticasDetalhadoComponent } from './ver-sugestao-boas-praticas-detalhado.component';

describe('VerSugestaoBoasPraticasDetalhadoComponent', () => {
  let component: VerSugestaoBoasPraticasDetalhadoComponent;
  let fixture: ComponentFixture<VerSugestaoBoasPraticasDetalhadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSugestaoBoasPraticasDetalhadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSugestaoBoasPraticasDetalhadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
