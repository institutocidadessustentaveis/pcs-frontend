import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumCadastroDiscussaoComponent } from './forum-cadastro-discussao.component';

describe('ForumCadastroDiscussaoComponent', () => {
  let component: ForumCadastroDiscussaoComponent;
  let fixture: ComponentFixture<ForumCadastroDiscussaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumCadastroDiscussaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumCadastroDiscussaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
