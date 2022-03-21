import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCertificadoComponent } from './historico-certificado.component';

describe('HistoricoCertificadoComponent', () => {
  let component: HistoricoCertificadoComponent;
  let fixture: ComponentFixture<HistoricoCertificadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoCertificadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
