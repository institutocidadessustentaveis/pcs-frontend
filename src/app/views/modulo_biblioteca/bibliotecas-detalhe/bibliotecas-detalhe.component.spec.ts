import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecasDetalheComponent } from './bibliotecas-detalhe.component';

describe('BibliotecasDetalheComponent', () => {
  let component: BibliotecasDetalheComponent;
  let fixture: ComponentFixture<BibliotecasDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliotecasDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecasDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
