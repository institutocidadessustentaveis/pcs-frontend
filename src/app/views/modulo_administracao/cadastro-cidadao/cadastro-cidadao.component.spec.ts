import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCidadaoComponent } from './cadastro-cidadao.component';

describe('CadastroCidadaoComponent', () => {
  let component: CadastroCidadaoComponent;
  let fixture: ComponentFixture<CadastroCidadaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroCidadaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroCidadaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
