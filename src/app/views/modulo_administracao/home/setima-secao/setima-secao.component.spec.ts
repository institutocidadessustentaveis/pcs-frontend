import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetimaSecaoComponent } from './setima-secao.component';


describe('SetimaSecaoComponent', () => {
  let component: SetimaSecaoComponent;
  let fixture: ComponentFixture<SetimaSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetimaSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetimaSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
