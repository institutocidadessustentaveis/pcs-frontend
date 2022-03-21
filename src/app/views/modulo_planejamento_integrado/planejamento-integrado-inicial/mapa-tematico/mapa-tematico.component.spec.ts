import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaTematicoComponent } from './mapa-tematico.component';

describe('MapaTematicoComponent', () => {
  let component: MapaTematicoComponent;
  let fixture: ComponentFixture<MapaTematicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaTematicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaTematicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
