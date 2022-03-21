import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoFocalDetalhesComponent } from './ponto-focal-detalhes.component';

describe('PontoFocalDetalhesComponent', () => {
  let component: PontoFocalDetalhesComponent;
  let fixture: ComponentFixture<PontoFocalDetalhesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontoFocalDetalhesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontoFocalDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
