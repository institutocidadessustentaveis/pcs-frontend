import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoVariaveisComponent } from './avaliacao-variaveis.component';

describe('AvaliacaoVariaveisComponent', () => {
  let component: AvaliacaoVariaveisComponent;
  let fixture: ComponentFixture<AvaliacaoVariaveisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoVariaveisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoVariaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
