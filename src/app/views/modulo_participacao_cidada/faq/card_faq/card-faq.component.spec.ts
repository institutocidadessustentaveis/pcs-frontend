import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFaqComponent } from './card-faq.component';

describe('CardFaqComponent', () => {
  let component: CardFaqComponent;
  let fixture: ComponentFixture<CardFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
