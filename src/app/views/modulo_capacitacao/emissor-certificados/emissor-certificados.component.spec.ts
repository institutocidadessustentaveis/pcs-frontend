import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissorCertificadosComponent } from './emissor-certificados.component';

describe('EmissorCertificadosComponent', () => {
  let component: EmissorCertificadosComponent;
  let fixture: ComponentFixture<EmissorCertificadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmissorCertificadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissorCertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
