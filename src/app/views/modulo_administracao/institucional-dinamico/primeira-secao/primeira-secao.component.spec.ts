import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Template02Component } from './primeira-secao.component';

describe('Template02Component', () => {
  let component: Template02Component;
  let fixture: ComponentFixture<Template02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
