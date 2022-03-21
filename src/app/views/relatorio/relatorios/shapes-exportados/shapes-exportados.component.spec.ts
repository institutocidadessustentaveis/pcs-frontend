import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesExportadosComponent } from './shapes-exportados.component';

describe('ShapesExportadosComponent', () => {
  let component: ShapesExportadosComponent;
  let fixture: ComponentFixture<ShapesExportadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapesExportadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapesExportadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
