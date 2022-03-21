import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIndicadoresEixoComponent } from './lista-indicadores-eixo.component';

describe('ListaIndicadoresEixoComponent', () => {
  let component: ListaIndicadoresEixoComponent;
  let fixture: ComponentFixture<ListaIndicadoresEixoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIndicadoresEixoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIndicadoresEixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
