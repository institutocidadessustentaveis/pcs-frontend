import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecaoLateralComponent } from './secao-lateral.component';

describe('TerceiraSecaoComponent', () => {
  let component: SecaoLateralComponent;
  let fixture: ComponentFixture<SecaoLateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecaoLateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecaoLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
