import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeiraSecaoViewComponent } from './primeira-secao-view.component';

describe('PrimeiraSecaoViewComponent', () => {
  let component: PrimeiraSecaoViewComponent;
  let fixture: ComponentFixture<PrimeiraSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeiraSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeiraSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
