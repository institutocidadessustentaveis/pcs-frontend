import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDiscussoesComponent } from './forum-discussoes.component';

describe('ForumDiscussoesComponent', () => {
  let component: ForumDiscussoesComponent;
  let fixture: ComponentFixture<ForumDiscussoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumDiscussoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDiscussoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
