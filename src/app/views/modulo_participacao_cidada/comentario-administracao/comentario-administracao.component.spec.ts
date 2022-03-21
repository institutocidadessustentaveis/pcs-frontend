import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentarioAdministracaoComponent } from './comentario-administracao.component';

describe('ComentarioAdministracaoComponent', () => {
  let component: ComentarioAdministracaoComponent;
  let fixture: ComponentFixture<ComentarioAdministracaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComentarioAdministracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentarioAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
