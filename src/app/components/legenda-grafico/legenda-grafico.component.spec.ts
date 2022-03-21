import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendaGraficoComponent } from './legenda-grafico.component';

describe('LegendaGraficoComponent', () => {
  let component: LegendaGraficoComponent;
  let fixture: ComponentFixture<LegendaGraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendaGraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendaGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
