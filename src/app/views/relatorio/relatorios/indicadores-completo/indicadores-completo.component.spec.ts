import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresCompletoComponent } from './indicadores-completo.component';

describe('IndicadoresCompletoComponent', () => {
  let component: IndicadoresCompletoComponent;
  let fixture: ComponentFixture<IndicadoresCompletoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresCompletoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
