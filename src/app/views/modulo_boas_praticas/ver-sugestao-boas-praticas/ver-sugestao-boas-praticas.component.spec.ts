import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSugestaoBoasPraticasComponent } from './ver-sugestao-boas-praticas.component';

describe('VerSugestaoBoasPraticasComponent', () => {
  let component: VerSugestaoBoasPraticasComponent;
  let fixture: ComponentFixture<VerSugestaoBoasPraticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSugestaoBoasPraticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSugestaoBoasPraticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
