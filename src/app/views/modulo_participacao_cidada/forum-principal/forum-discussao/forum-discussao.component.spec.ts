import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDiscussaoComponent } from './forum-discussao.component';

describe('ForumDiscussaoComponent', () => {
  let component: ForumDiscussaoComponent;
  let fixture: ComponentFixture<ForumDiscussaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumDiscussaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDiscussaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
