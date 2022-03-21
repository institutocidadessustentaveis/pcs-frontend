import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadSenhaPrefeituraComponent } from './cad-senha-prefeitura.component';

describe('CadSenhaPrefeituraComponent', () => {
  let component: CadSenhaPrefeituraComponent;
  let fixture: ComponentFixture<CadSenhaPrefeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadSenhaPrefeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadSenhaPrefeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
