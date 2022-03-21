import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDadosDownloadComponent } from './lista-dados-download.component';

describe('ListaDadosDownloadComponent', () => {
  let component: ListaDadosDownloadComponent;
  let fixture: ComponentFixture<ListaDadosDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaDadosDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDadosDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
