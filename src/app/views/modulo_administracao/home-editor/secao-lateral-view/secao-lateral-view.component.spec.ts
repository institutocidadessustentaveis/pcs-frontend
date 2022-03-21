import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecaoLateralViewComponent } from './secao-lateral-view.component';

describe('TerceiraSecaoComponent', () => {
  let component: SecaoLateralViewComponent;
  let fixture: ComponentFixture<SecaoLateralViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecaoLateralViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecaoLateralViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
