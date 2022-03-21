import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoRelatorioGeradoComponent } from './historico-relatorio-gerado.component';

describe('HistoricoRelatorioGeradoComponent', () => {
  let component: HistoricoRelatorioGeradoComponent;
  let fixture: ComponentFixture<HistoricoRelatorioGeradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoRelatorioGeradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoRelatorioGeradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
