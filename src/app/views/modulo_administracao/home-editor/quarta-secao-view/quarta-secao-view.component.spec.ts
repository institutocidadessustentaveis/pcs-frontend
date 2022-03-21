import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartaSecaoViewComponent } from './quarta-secao-view.component';

describe('QuartaSecaoViewComponent', () => {
  let component: QuartaSecaoViewComponent;
  let fixture: ComponentFixture<QuartaSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuartaSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartaSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
