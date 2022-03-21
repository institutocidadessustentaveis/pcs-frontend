import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSolucaoComponent } from './card-solucao.component';

describe('CardSolucaoComponent', () => {
  let component: CardSolucaoComponent;
  let fixture: ComponentFixture<CardSolucaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSolucaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
