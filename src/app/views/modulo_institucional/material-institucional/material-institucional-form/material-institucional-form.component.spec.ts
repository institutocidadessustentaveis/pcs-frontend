import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInstitucionalFormComponent } from './material-institucional-form.component';

describe('MaterialInstitucionalFormComponent', () => {
  let component: MaterialInstitucionalFormComponent;
  let fixture: ComponentFixture<MaterialInstitucionalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInstitucionalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInstitucionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
