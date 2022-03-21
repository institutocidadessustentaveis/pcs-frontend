import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoVariaveisListComponent } from './avaliacao-variaveis-list.component';

describe('AvaliacaoVariaveisListComponent', () => {
  let component: AvaliacaoVariaveisListComponent;
  let fixture: ComponentFixture<AvaliacaoVariaveisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoVariaveisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoVariaveisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
