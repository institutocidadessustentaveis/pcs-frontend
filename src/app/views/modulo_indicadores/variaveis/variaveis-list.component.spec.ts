import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariavelListComponent } from './variaveis-list.component';

describe('VariavelListComponent', () => {
  let component: VariavelListComponent;
  let fixture: ComponentFixture<VariavelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariavelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariavelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
