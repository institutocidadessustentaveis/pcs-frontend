import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecaoLateral2Component } from './secao-lateral-2.component';




describe('SecaoLateral2Component', () => {
  let component: SecaoLateral2Component;
  let fixture: ComponentFixture<SecaoLateral2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecaoLateral2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecaoLateral2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
