import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilUsuarioForumComponent } from './perfil-usuario-forum.component';

describe('PerfilUsuarioForumComponent', () => {
  let component: PerfilUsuarioForumComponent;
  let fixture: ComponentFixture<PerfilUsuarioForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilUsuarioForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
