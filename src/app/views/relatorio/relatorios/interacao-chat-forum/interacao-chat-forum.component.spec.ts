import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteracaoChatForumComponent } from './interacao-chat-forum.component';

describe('InteracaoChatForumComponent', () => {
  let component: InteracaoChatForumComponent;
  let fixture: ComponentFixture<InteracaoChatForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteracaoChatForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteracaoChatForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
