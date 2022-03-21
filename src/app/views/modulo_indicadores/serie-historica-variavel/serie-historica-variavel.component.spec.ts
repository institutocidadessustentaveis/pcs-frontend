import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieHistoricaVariavelComponent } from './serie-historica-variavel.component';

describe('SerieHistoricaVariavelComponent', () => {
  let component: SerieHistoricaVariavelComponent;
  let fixture: ComponentFixture<SerieHistoricaVariavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerieHistoricaVariavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerieHistoricaVariavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
