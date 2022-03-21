import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaInstitucionalDetalheComponent } from './pagina-institucional-detalhe.component';

describe('PaginaInstitucionalDetalheComponent', () => {
  let component: PaginaInstitucionalDetalheComponent;
  let fixture: ComponentFixture<PaginaInstitucionalDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaInstitucionalDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaInstitucionalDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
