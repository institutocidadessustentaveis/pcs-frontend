import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionalDinamicoComponent } from './institucional-dinamico.component';

describe('PaginaInstitucionalDetalheComponent', () => {
  let component: InstitucionalDinamicoComponent;
  let fixture: ComponentFixture<InstitucionalDinamicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucionalDinamicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionalDinamicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
