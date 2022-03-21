import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioDeEventosComponent } from './relatorio-de-eventos.component';

describe('RelatorioDeEventosComponent', () => {
  let component: RelatorioDeEventosComponent;
  let fixture: ComponentFixture<RelatorioDeEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioDeEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioDeEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
