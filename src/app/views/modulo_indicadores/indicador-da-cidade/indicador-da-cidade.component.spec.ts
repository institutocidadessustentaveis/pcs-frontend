import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorDaCidadeComponent } from './indicador-da-cidade.component';

describe('IndicadorDaCidadeComponent', () => {
  let component: IndicadorDaCidadeComponent;
  let fixture: ComponentFixture<IndicadorDaCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorDaCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorDaCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
