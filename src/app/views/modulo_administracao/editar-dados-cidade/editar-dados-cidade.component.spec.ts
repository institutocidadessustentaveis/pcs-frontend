import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDadosCidadeComponent } from './editar-dados-cidade.component';

describe('EditarDadosCidadeComponent', () => {
  let component: EditarDadosCidadeComponent;
  let fixture: ComponentFixture<EditarDadosCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarDadosCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarDadosCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
