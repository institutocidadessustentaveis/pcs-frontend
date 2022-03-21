import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuintaSecaoViewComponent } from './quinta-secao-view.component';

describe('QuintaSecaoViewComponent', () => {
  let component: QuintaSecaoViewComponent;
  let fixture: ComponentFixture<QuintaSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuintaSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuintaSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
