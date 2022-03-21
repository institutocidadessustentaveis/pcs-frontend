import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosDownloadComponent } from './dados-download.component';

describe('DadosDownloadComponent', () => {
  let component: DadosDownloadComponent;
  let fixture: ComponentFixture<DadosDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DadosDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
