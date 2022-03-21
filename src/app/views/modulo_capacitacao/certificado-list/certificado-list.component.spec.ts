import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoListComponent } from './certificado-list.component';

describe('CertificadoListComponent', () => {
  let component: CertificadoListComponent;
  let fixture: ComponentFixture<CertificadoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
