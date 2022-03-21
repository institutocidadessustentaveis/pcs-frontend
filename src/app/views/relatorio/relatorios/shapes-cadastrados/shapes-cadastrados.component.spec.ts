import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioPlanoDeMetasComponent } from './relatorio-plano-de-metas.component';

describe('RelatorioPlanoDeMetasComponent', () => {
  let component: RelatorioPlanoDeMetasComponent;
  let fixture: ComponentFixture<RelatorioPlanoDeMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioPlanoDeMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioPlanoDeMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
