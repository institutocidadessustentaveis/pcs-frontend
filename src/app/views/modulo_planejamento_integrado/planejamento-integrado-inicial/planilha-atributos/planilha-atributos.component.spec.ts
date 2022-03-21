import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanilhaAtributosComponent } from './planilha-atributos.component';

describe('PlanilhaAtributosComponent', () => {
  let component: PlanilhaAtributosComponent;
  let fixture: ComponentFixture<PlanilhaAtributosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanilhaAtributosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanilhaAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
