import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresVisualizarComponent } from './indicadores-visualizar.component';

describe('IndicadoresVisualizarComponent', () => {
  let component: IndicadoresVisualizarComponent;
  let fixture: ComponentFixture<IndicadoresVisualizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresVisualizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresVisualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
