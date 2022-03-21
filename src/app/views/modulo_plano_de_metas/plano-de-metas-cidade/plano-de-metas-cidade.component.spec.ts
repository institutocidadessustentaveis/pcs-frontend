import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanoDeMetasCidadeComponent } from './plano-de-metas-cidade.component';



describe('PlanoMetasComponent', () => {
  let component: PlanoDeMetasCidadeComponent;
  let fixture: ComponentFixture<PlanoDeMetasCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoDeMetasCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoDeMetasCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
