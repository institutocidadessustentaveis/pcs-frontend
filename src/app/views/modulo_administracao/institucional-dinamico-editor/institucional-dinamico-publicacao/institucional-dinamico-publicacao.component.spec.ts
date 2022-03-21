import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InstitucionalDinamicoPublicacaoComponent } from './institucional-dinamico-publicacao.component';


describe('InstitucionalPublicacaoComponent', () => {
  let component: InstitucionalDinamicoPublicacaoComponent;
  let fixture: ComponentFixture<InstitucionalDinamicoPublicacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucionalDinamicoPublicacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionalDinamicoPublicacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
