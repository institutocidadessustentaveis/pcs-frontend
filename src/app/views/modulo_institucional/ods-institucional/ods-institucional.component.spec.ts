import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdsInstitucionalComponent } from './ods-institucional.component';

describe('OdsInstitucionalComponent', () => {
  let component: OdsInstitucionalComponent;
  let fixture: ComponentFixture<OdsInstitucionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdsInstitucionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdsInstitucionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
