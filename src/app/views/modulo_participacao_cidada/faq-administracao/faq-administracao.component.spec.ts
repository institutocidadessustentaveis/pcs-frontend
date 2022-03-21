import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAdministracaoComponent } from './faq-administracao.component';

describe('FaqAdministracaoComponent', () => {
  let component: FaqAdministracaoComponent;
  let fixture: ComponentFixture<FaqAdministracaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqAdministracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
