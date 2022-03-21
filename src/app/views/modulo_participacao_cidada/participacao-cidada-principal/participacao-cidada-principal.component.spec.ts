import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacaoCidadaPrincipalComponent } from './participacao-cidada-principal.component';

describe('ParticipacaoCidadaPrincipalComponent', () => {
  let component: ParticipacaoCidadaPrincipalComponent;
  let fixture: ComponentFixture<ParticipacaoCidadaPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipacaoCidadaPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipacaoCidadaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
