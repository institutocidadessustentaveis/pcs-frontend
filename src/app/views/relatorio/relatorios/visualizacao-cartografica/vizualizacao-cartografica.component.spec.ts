import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoCartograficaComponent } from './vizualizacao-cartografica.component';

describe('VizualizacaoCartograficaComponent', () => {
  let component: VisualizacaoCartograficaComponent;
  let fixture: ComponentFixture<VisualizacaoCartograficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizacaoCartograficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizacaoCartograficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
