import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InstitucionalDinamicoPublicacaoVisualizacaoComponent } from './institucional-dinamico-publicacao-visualizacao.component';


describe('InstitucionalPublicacaoVisualizacaoComponent', () => {
  let component: InstitucionalDinamicoPublicacaoVisualizacaoComponent;
  let fixture: ComponentFixture<InstitucionalDinamicoPublicacaoVisualizacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucionalDinamicoPublicacaoVisualizacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionalDinamicoPublicacaoVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
