import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariavelComponent } from './variaveis.component';

describe('VariavelComponent', () => {
  let component: VariavelComponent;
  let fixture: ComponentFixture<VariavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
