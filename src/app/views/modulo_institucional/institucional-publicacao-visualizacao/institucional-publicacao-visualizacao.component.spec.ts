import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionalPublicacaoVisualizacaoComponent } from './institucional-publicacao-visualizacao.component';

describe('InstitucionalPublicacaoVisualizacaoComponent', () => {
  let component: InstitucionalPublicacaoVisualizacaoComponent;
  let fixture: ComponentFixture<InstitucionalPublicacaoVisualizacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucionalPublicacaoVisualizacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionalPublicacaoVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
