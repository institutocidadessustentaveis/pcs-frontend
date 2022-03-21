import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecasComponent } from './bibliotecas.component';

describe('BibliotecasComponent', () => {
  let component: BibliotecasComponent;
  let fixture: ComponentFixture<BibliotecasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliotecasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
