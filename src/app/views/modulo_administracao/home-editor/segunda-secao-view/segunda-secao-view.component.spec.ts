import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegundaSecaoViewComponent } from './segunda-secao-view.component';

describe('SegundaSecaoViewComponent', () => {
  let component: SegundaSecaoViewComponent;
  let fixture: ComponentFixture<SegundaSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegundaSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegundaSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
