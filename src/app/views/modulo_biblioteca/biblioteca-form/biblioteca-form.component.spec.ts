import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaFormComponent } from './biblioteca-form.component';

describe('BibliotecaFormComponent', () => {
  let component: BibliotecaFormComponent;
  let fixture: ComponentFixture<BibliotecaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliotecaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
