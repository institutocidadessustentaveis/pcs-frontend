import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreVisualizacaoComponent } from './pre-visualizacao.component';

describe('PreVisualizacaoComponent', () => {
  let component: PreVisualizacaoComponent;
  let fixture: ComponentFixture<PreVisualizacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreVisualizacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
