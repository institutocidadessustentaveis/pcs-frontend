import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecaoLateral1Component } from './secao-lateral-1.component';



describe('TerceiraSecaoComponent', () => {
  let component: SecaoLateral1Component;
  let fixture: ComponentFixture<SecaoLateral1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecaoLateral1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecaoLateral1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
