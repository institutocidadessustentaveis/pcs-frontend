import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVariavelPreenchidaComponent } from './lista-variavel-preenchida.component';

describe('ListaVariavelPreenchidaComponent', () => {
  let component: ListaVariavelPreenchidaComponent;
  let fixture: ComponentFixture<ListaVariavelPreenchidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaVariavelPreenchidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaVariavelPreenchidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
