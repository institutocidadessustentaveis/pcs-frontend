import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasForumListComponent } from './temas-forum-list.component';

describe('TemasForumListComponent', () => {
  let component: TemasForumListComponent;
  let fixture: ComponentFixture<TemasForumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemasForumListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemasForumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
