import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialApoioFormComponent } from './material-apoio-form.component';

describe('MaterialApoioFormComponent', () => {
  let component: MaterialApoioFormComponent;
  let fixture: ComponentFixture<MaterialApoioFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialApoioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialApoioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
