import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosPrincipalComponent } from './eventos-principal.component';

describe('EventosPrincipalComponent', () => {
  let component: EventosPrincipalComponent;
  let fixture: ComponentFixture<EventosPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
