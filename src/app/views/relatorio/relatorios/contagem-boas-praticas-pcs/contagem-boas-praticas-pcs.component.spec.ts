import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemBoasPraticasPcsComponent } from './contagem-boas-praticas-pcs.component';

describe('ContagemBoasPraticasPcsComponent', () => {
  let component: ContagemBoasPraticasPcsComponent;
  let fixture: ComponentFixture<ContagemBoasPraticasPcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemBoasPraticasPcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemBoasPraticasPcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
