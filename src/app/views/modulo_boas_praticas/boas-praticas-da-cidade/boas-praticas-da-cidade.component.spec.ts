import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoasPraticasDaCidadeComponent } from './boas-praticas-da-cidade.component';

describe('BoasPraticasDaCidadeComponent', () => {
  let component: BoasPraticasDaCidadeComponent;
  let fixture: ComponentFixture<BoasPraticasDaCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoasPraticasDaCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoasPraticasDaCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
