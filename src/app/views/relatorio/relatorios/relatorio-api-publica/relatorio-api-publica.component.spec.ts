import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioApiPublicaComponent } from './relatorio-api-publica.component';

describe('RelatorioApiPublicaComponent', () => {
  let component: RelatorioApiPublicaComponent;
  let fixture: ComponentFixture<RelatorioApiPublicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioApiPublicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioApiPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
