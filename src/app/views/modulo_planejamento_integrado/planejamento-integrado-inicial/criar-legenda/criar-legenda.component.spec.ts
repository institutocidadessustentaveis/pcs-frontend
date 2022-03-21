import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarLegendaComponent } from './criar-legenda.component';

describe('EditarAtributosComponent', () => {
  let component: CriarLegendaComponent;
  let fixture: ComponentFixture<CriarLegendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarLegendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarLegendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
