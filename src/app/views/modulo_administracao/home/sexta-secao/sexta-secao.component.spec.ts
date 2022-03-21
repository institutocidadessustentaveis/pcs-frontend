import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SextaSecaoComponent } from './sexta-secao.component';

describe('SextaSecaoComponent', () => {
  let component: SextaSecaoComponent;
  let fixture: ComponentFixture<SextaSecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SextaSecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SextaSecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
