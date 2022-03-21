import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesGeraisComponent } from './ajustes-gerais.component';

describe('AjustesGeraisComponent', () => {
  let component: AjustesGeraisComponent;
  let fixture: ComponentFixture<AjustesGeraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjustesGeraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjustesGeraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
