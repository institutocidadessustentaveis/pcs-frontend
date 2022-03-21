import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialApoioPrincipalComponent } from './material-apoio-principal.component';

describe('MaterialApoioPrincipalComponent', () => {
  let component: MaterialApoioPrincipalComponent;
  let fixture: ComponentFixture<MaterialApoioPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialApoioPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialApoioPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
