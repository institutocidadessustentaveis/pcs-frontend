import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroIndicadorComponent } from './filtro-indicador.component';

describe('FiltroVariavelComponent', () => {
  let component: FiltroIndicadorComponent;
  let fixture: ComponentFixture<FiltroIndicadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroIndicadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
