import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreVisualizacaoNoticiaComponent } from './pre-visualizacao-noticia.component';

describe('PreVisualizacaoNoticiaComponent', () => {
  let component: PreVisualizacaoNoticiaComponent;
  let fixture: ComponentFixture<PreVisualizacaoNoticiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreVisualizacaoNoticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreVisualizacaoNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
