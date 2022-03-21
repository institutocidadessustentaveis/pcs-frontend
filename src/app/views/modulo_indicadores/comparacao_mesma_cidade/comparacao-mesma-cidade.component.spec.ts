import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararIndicadoresDiferentesMesmaCidadeComponent } from './comparar-indicadores-diferentes-mesmacidade.component';

describe('PainelIndicadoresCidadeComponent', () => {
  let component: CompararIndicadoresDiferentesMesmaCidadeComponent;
  let fixture: ComponentFixture<CompararIndicadoresDiferentesMesmaCidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompararIndicadoresDiferentesMesmaCidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararIndicadoresDiferentesMesmaCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
