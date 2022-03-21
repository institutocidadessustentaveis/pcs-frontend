import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreenchimentoIndicadoresComponent } from './preenchimento-indicadores.component';

describe('PreenchimentoIndicadoresComponent', () => {
  let component: PreenchimentoIndicadoresComponent;
  let fixture: ComponentFixture<PreenchimentoIndicadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreenchimentoIndicadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreenchimentoIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
