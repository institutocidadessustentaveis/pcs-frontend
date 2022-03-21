import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetimaSecaoViewComponent } from './setima-secao-view.component';

describe('SetimaSecaoViewComponent', () => {
  let component: SetimaSecaoViewComponent;
  let fixture: ComponentFixture<SetimaSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetimaSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetimaSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
