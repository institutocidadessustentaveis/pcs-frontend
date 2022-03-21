import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoasPraticasCidadesSignatariasComponent } from './boas-praticas-cidades-signatarias.component';

describe('BoasPraticasCidadesSignatariasComponent', () => {
  let component: BoasPraticasCidadesSignatariasComponent;
  let fixture: ComponentFixture<BoasPraticasCidadesSignatariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoasPraticasCidadesSignatariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoasPraticasCidadesSignatariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
