import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoasPraticasFormComponent } from './boas-praticas-form.component';

describe('BoasPraticasComponent', () => {
  let component: BoasPraticasFormComponent;
  let fixture: ComponentFixture<BoasPraticasFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoasPraticasFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoasPraticasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
