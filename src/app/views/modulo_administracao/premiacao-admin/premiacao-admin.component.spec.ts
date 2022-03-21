import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiacaoAdminComponent } from './premiacao-admin.component';

describe('PremiacaoAdminComponent', () => {
  let component: PremiacaoAdminComponent;
  let fixture: ComponentFixture<PremiacaoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiacaoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiacaoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
