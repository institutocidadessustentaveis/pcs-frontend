import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerceiraSecaoComponent } from './terceira-secao.component';

describe('TerceiraSecaoComponent', () => {
  let component: TerceiraSecaoComponent;
  let fixture: ComponentFixture<TerceiraSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerceiraSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerceiraSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
