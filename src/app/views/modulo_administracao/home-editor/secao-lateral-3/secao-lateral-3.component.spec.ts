import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecaoLateral3Component } from './secao-lateral-3.component';




describe('SecaoLateral3Component', () => {
  let component: SecaoLateral3Component;
  let fixture: ComponentFixture<SecaoLateral3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecaoLateral3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecaoLateral3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
