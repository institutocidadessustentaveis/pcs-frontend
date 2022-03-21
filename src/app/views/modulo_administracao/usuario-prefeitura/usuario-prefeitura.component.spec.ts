import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPrefeituraComponent } from './usuario-prefeitura.component';

describe('UsuarioPrefeituraComponent', () => {
  let component: UsuarioPrefeituraComponent;
  let fixture: ComponentFixture<UsuarioPrefeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioPrefeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioPrefeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
