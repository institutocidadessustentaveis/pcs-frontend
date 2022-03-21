import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInstitucionalListComponent } from './material-institucional-list.component';

describe('MaterialInstitucionalListComponent', () => {
  let component: MaterialInstitucionalListComponent;
  let fixture: ComponentFixture<MaterialInstitucionalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInstitucionalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInstitucionalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
