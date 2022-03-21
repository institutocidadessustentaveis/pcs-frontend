import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresDetalhesComponent } from './indicadores-detalhes.component';

describe('IndicadoresDetalhesComponent', () => {
  let component: IndicadoresDetalhesComponent;
  let fixture: ComponentFixture<IndicadoresDetalhesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresDetalhesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
