import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanosLeisComponent } from './planos-leis.component';

describe('PlanosLeisComponent', () => {
  let component: PlanosLeisComponent;
  let fixture: ComponentFixture<PlanosLeisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanosLeisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanosLeisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
