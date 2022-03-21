import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SextaSecaoViewComponent } from './sexta-secao-view.component';


describe('SextaSecaoViewComponent', () => {
  let component: SextaSecaoViewComponent;
  let fixture: ComponentFixture<SextaSecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SextaSecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SextaSecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
