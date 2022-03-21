import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPoligonoComponent } from './criar-poligono.component';

describe('EditarAtributosComponent', () => {
  let component: CriarPoligonoComponent;
  let fixture: ComponentFixture<CriarPoligonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarPoligonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarPoligonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
