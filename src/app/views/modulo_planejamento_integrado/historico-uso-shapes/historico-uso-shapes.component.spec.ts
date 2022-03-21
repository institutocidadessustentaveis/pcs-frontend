import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoUsoShapesComponent } from './historico-uso-shapes.component';

describe('HistoricoUsoShapesComponent', () => {
  let component: HistoricoUsoShapesComponent;
  let fixture: ComponentFixture<HistoricoUsoShapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoUsoShapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoUsoShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
