import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardContribuicoesAcademicasComponent } from './card-contribuicoes-academicas.component';

describe('CardContribuicoesAcademicasComponent', () => {
  let component: CardContribuicoesAcademicasComponent;
  let fixture: ComponentFixture<CardContribuicoesAcademicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardContribuicoesAcademicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardContribuicoesAcademicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
