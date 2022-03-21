import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportadorRelatoriosComponent } from './exportador-relatorios.component';

describe('ExportadorRelatoriosComponent', () => {
  let component: ExportadorRelatoriosComponent;
  let fixture: ComponentFixture<ExportadorRelatoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportadorRelatoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportadorRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
