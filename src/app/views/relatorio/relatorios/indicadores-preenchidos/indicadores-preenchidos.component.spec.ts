import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresPreenchidosComponent } from './indicadores-preenchidos.component';

describe('IndicadoresPreenchidosComponent', () => {
  let component: IndicadoresPreenchidosComponent;
  let fixture: ComponentFixture<IndicadoresPreenchidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresPreenchidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresPreenchidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
