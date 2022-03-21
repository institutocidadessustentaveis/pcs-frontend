import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadesSignatariasComponent } from './cidades-signatarias.component';

describe('CidadesSignatariasComponent', () => {
  let component: CidadesSignatariasComponent;
  let fixture: ComponentFixture<CidadesSignatariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CidadesSignatariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CidadesSignatariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
