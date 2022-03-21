import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScripCriarUsuariosPrefeitosComponent } from './scrip-criar-usuarios-prefeitos.component';

describe('ScripCriarUsuariosPrefeitosComponent', () => {
  let component: ScripCriarUsuariosPrefeitosComponent;
  let fixture: ComponentFixture<ScripCriarUsuariosPrefeitosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScripCriarUsuariosPrefeitosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScripCriarUsuariosPrefeitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
