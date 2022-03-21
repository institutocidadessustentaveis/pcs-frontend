import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerceiraSecaoViewComponent } from './terceira-secao-view.component';

describe('TerceiraSecaoViewComponent', () => {
  let component: TerceiraSecaoViewComponent;
  let fixture: ComponentFixture<TerceiraSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerceiraSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerceiraSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
