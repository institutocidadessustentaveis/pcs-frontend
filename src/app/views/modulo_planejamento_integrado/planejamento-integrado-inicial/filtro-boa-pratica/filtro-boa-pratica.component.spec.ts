import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBoaPraticaComponent } from './filtro-boa-pratica.component';

describe('FiltroBoaPraticaComponent', () => {
  let component: FiltroBoaPraticaComponent;
  let fixture: ComponentFixture<FiltroBoaPraticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBoaPraticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBoaPraticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
