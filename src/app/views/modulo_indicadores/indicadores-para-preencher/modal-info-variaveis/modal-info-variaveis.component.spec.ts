import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoVariaveisComponent } from './modal-info-variaveis.component';

describe('ModalInfoVariaveisComponent', () => {
  let component: ModalInfoVariaveisComponent;
  let fixture: ComponentFixture<ModalInfoVariaveisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoVariaveisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoVariaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
