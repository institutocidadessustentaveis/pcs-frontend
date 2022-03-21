import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EixoFormComponent } from './eixo-form.component';

describe('EixoFormComponent', () => {
  let component: EixoFormComponent;
  let fixture: ComponentFixture<EixoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EixoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EixoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
