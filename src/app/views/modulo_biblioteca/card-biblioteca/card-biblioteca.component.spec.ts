import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBibliotecaComponent } from './card-biblioteca.component';

describe('CardBibliotecaComponent', () => {
  let component: CardBibliotecaComponent;
  let fixture: ComponentFixture<CardBibliotecaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBibliotecaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBibliotecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
