import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClasseComponent } from './dialog-classe.component';

describe('DialogClasseComponent', () => {
  let component: DialogClasseComponent;
  let fixture: ComponentFixture<DialogClasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogClasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
