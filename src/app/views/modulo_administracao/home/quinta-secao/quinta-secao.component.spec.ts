import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuintaSecaoComponent } from './quinta-secao.component';

describe('QuintaSecaoComponent', () => {
  let component: QuintaSecaoComponent;
  let fixture: ComponentFixture<QuintaSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuintaSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuintaSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
