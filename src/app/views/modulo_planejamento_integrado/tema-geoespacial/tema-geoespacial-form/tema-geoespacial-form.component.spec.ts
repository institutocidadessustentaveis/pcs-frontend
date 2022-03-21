import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaGeoespacialFormComponent } from './tema-geoespacial-form.component';

describe('TemaGeoespacialFormComponent', () => {
  let component: TemaGeoespacialFormComponent;
  let fixture: ComponentFixture<TemaGeoespacialFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemaGeoespacialFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemaGeoespacialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
