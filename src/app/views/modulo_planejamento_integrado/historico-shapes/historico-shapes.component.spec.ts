import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoShapesComponent } from './historico-shapes.component';

describe('HistoricoShapesComponent', () => {
  let component: HistoricoShapesComponent;
  let fixture: ComponentFixture<HistoricoShapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoShapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
