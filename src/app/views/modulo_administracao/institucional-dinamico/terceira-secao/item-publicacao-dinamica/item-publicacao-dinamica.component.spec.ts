import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemPublicacaoDinamicaComponent } from './item-publicacao-dinamica.component';


describe('ItemPublicacaoComponent', () => {
  let component: ItemPublicacaoDinamicaComponent;
  let fixture: ComponentFixture<ItemPublicacaoDinamicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPublicacaoDinamicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPublicacaoDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
