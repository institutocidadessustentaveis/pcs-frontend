import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SugestaoBoasPraticasComponent } from './sugestao-boas-praticas.component';

describe('SugestaoBoasPraticasComponent', () => {
  let component: SugestaoBoasPraticasComponent;
  let fixture: ComponentFixture<SugestaoBoasPraticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SugestaoBoasPraticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SugestaoBoasPraticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
