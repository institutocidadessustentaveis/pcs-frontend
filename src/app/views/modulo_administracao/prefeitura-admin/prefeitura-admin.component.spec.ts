import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefeituraAdminComponent } from './prefeitura-admin.component';

describe('PrefeituraAdminComponent', () => {
  let component: PrefeituraAdminComponent;
  let fixture: ComponentFixture<PrefeituraAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefeituraAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefeituraAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
