import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventosDetalheComponent } from './eventos-detalhe.component';



describe('IndicadoresVisualizarComponent', () => {
  let component: EventosDetalheComponent;
  let fixture: ComponentFixture<EventosDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
