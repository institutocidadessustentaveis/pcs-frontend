import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposAcademicosComponent } from './grupos-academicos.component';

describe('GruposAcademicosComponent', () => {
  let component: GruposAcademicosComponent;
  let fixture: ComponentFixture<GruposAcademicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposAcademicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposAcademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
