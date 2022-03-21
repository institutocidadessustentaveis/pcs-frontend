import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoasPraticasPcsComponent } from './boas-praticas-pcs.component';

describe('BoasPraticasPcsComponent', () => {
  let component: BoasPraticasPcsComponent;
  let fixture: ComponentFixture<BoasPraticasPcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoasPraticasPcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoasPraticasPcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
