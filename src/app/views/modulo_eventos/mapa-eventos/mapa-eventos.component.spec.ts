import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaEventosComponent } from './mapa-eventos.component';

describe('MapaEventosComponent', () => {
  let component: MapaEventosComponent;
  let fixture: ComponentFixture<MapaEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
