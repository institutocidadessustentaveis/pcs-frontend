import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialApoioListComponent } from './material-apoio-list.component';

describe('MaterialApoioListComponent', () => {
  let component: MaterialApoioListComponent;
  let fixture: ComponentFixture<MaterialApoioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialApoioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialApoioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
