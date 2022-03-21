import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarIndiceSecaoComponent } from './editar-indice-secao.component';




describe('EditarAtributosComponent', () => {
  let component: EditarIndiceSecaoComponent;
  let fixture: ComponentFixture<EditarIndiceSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarIndiceSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarIndiceSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
