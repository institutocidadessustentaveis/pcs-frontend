import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiacaoAdminFormComponent } from './premiacao-admin-form.component';

describe('PaisFormComponent', () => {
  let component: PremiacaoAdminFormComponent;
  let fixture: ComponentFixture<PremiacaoAdminFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiacaoAdminFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiacaoAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
