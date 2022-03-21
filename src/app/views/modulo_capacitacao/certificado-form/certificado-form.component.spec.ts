import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoFormComponent } from './certificado-form.component';

describe('CertificadoFormComponent', () => {
  let component: CertificadoFormComponent;
  let fixture: ComponentFixture<CertificadoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
