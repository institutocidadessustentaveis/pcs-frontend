import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCidadesSignatariasComponent } from './historico-cidades-signatarias.component';

describe('HistoricoCidadesSignatariasComponent', () => {
  let component: HistoricoCidadesSignatariasComponent;
  let fixture: ComponentFixture<HistoricoCidadesSignatariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoCidadesSignatariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoCidadesSignatariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
