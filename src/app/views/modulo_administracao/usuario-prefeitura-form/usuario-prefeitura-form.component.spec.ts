import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPrefeituraFormComponent } from './usuario-prefeitura-form.component';

describe('UsuarioPrefeituraFormComponent', () => {
  let component: UsuarioPrefeituraFormComponent;
  let fixture: ComponentFixture<UsuarioPrefeituraFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioPrefeituraFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioPrefeituraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
