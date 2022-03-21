import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SegundaSecaoComponent } from './segunda-secao.component';


describe('SegundaSecaoComponent', () => {
  let component: SegundaSecaoComponent;
  let fixture: ComponentFixture<SegundaSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegundaSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegundaSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
