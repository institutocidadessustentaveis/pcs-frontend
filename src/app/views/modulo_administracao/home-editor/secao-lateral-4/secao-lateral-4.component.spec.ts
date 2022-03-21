import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecaoLateral4Component } from './secao-lateral-4.component';




describe('SecaoLateral4Component', () => {
  let component: SecaoLateral4Component;
  let fixture: ComponentFixture<SecaoLateral4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecaoLateral4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecaoLateral4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
