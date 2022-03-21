import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuartaSecaoComponent } from './quarta-secao.component';


describe('SegundaSecaoComponent', () => {
  let component: QuartaSecaoComponent;
  let fixture: ComponentFixture<QuartaSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuartaSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartaSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
