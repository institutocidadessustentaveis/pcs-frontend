import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasForumFormComponent } from './temas-forum-form.component';

describe('TemasForumFormComponent', () => {
  let component: TemasForumFormComponent;
  let fixture: ComponentFixture<TemasForumFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemasForumFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemasForumFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
