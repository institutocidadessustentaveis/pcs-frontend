import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAtributosComponent } from './download-atributos.component';

describe('DownloadAtributosComponent', () => {
  let component: DownloadAtributosComponent;
  let fixture: ComponentFixture<DownloadAtributosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAtributosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
