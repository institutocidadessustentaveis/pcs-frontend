import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BoaPraticaDetalheComponent } from './boa-pratica-detalhe.component';


describe('BoaPraticaDetalheComponent', () => {
  let component: BoaPraticaDetalheComponent;
  let fixture: ComponentFixture<BoaPraticaDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoaPraticaDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoaPraticaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
