import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecalculoIndicadoresAdminComponent } from './recalculo-indicadores-admin.component';

describe('RecalculoIndicadoresAdminComponent', () => {
  let component: RecalculoIndicadoresAdminComponent;
  let fixture: ComponentFixture<RecalculoIndicadoresAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecalculoIndicadoresAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecalculoIndicadoresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
