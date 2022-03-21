import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosCalendarioComponent } from './eventos-calendario.component';

describe('EventosCalendarioComponent', () => {
  let component: EventosCalendarioComponent;
  let fixture: ComponentFixture<EventosCalendarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosCalendarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
