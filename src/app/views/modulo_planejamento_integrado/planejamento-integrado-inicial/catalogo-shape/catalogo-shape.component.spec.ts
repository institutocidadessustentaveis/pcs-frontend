import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoShapeComponent } from './catalogo-shape.component';

describe('CatalogoShapeComponent', () => {
  let component: CatalogoShapeComponent;
  let fixture: ComponentFixture<CatalogoShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
