import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteracaoComFerramentasComponent } from './interacao-com-ferramentas.component';

describe('InteracaoComFerramentasComponent', () => {
  let component: InteracaoComFerramentasComponent;
  let fixture: ComponentFixture<InteracaoComFerramentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteracaoComFerramentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteracaoComFerramentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
