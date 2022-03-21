import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExportacoesComponent } from './download-exportacoes.component';

describe('DownloadExportacoesComponent', () => {
  let component: DownloadExportacoesComponent;
  let fixture: ComponentFixture<DownloadExportacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadExportacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadExportacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
