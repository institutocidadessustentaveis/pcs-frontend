import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletimAdministracaoComponent } from './boletim-administracao.component';

describe('BoletimAdministracaoComponent', () => {
  let component: BoletimAdministracaoComponent;
  let fixture: ComponentFixture<BoletimAdministracaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoletimAdministracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletimAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
