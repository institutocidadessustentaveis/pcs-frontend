import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroVariavelComponent } from './filtro-variavel.component';

describe('FiltroVariavelComponent', () => {
  let component: FiltroVariavelComponent;
  let fixture: ComponentFixture<FiltroVariavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroVariavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroVariavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
