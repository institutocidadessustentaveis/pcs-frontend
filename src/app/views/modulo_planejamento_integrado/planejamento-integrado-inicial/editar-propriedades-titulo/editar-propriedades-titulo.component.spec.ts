import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPropriedadesComponent } from './editar-propriedades.component';



describe('EditarAtributosComponent', () => {
  let component: EditarPropriedadesComponent;
  let fixture: ComponentFixture<EditarPropriedadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPropriedadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPropriedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
