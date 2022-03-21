import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeFilesDetalheVisualizarComponent } from './shapefiles-detalhe-visualizar.component';

describe('IndicadoresVisualizarComponent', () => {
  let component: ShapeFilesDetalheVisualizarComponent;
  let fixture: ComponentFixture<ShapeFilesDetalheVisualizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeFilesDetalheVisualizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeFilesDetalheVisualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
