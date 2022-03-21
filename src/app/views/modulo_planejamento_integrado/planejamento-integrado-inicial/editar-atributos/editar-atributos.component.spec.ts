import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAtributosComponent } from './editar-atributos.component';

describe('EditarAtributosComponent', () => {
  let component: EditarAtributosComponent;
  let fixture: ComponentFixture<EditarAtributosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarAtributosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
