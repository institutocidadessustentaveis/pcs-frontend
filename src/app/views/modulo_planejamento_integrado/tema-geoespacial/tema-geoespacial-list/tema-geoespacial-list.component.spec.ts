import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaGeoespacialListComponent } from './tema-geoespacial-list.component';

describe('TemaGeoespacialListComponent', () => {
  let component: TemaGeoespacialListComponent;
  let fixture: ComponentFixture<TemaGeoespacialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemaGeoespacialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemaGeoespacialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
