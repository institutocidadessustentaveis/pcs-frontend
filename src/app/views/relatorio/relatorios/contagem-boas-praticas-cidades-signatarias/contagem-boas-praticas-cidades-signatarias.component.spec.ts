import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemBoasPraticasCidadesSignatariasComponent } from './contagem-boas-praticas-cidades-signatarias.component';

describe('ContagemBoasPraticasCidadesSignatariasComponent', () => {
  let component: ContagemBoasPraticasCidadesSignatariasComponent;
  let fixture: ComponentFixture<ContagemBoasPraticasCidadesSignatariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemBoasPraticasCidadesSignatariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemBoasPraticasCidadesSignatariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
