import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelIndicadoresCidadeComponent } from './painel-indicadores-cidade.component';

describe('PainelIndicadoresCidadeComponent', () => {
  let component: PainelIndicadoresCidadeComponent;
  let fixture: ComponentFixture<PainelIndicadoresCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelIndicadoresCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelIndicadoresCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
