import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoesGestoresMunicipaisComponent } from './acoes-gestores-municipais.component';

describe('AcoesGestoresMunicipaisComponent', () => {
  let component: AcoesGestoresMunicipaisComponent;
  let fixture: ComponentFixture<AcoesGestoresMunicipaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcoesGestoresMunicipaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcoesGestoresMunicipaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
