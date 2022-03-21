import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefeituraAdminFormComponent } from './prefeitura-admin-form.component';

describe('PrefeituraAdminFormComponent', () => {
  let component: PrefeituraAdminFormComponent;
  let fixture: ComponentFixture<PrefeituraAdminFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefeituraAdminFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefeituraAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
