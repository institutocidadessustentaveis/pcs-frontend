import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaCamadaComponent } from './nova-camada.component';

describe('FiltroVariavelComponent', () => {
  let component: NovaCamadaComponent;
  let fixture: ComponentFixture<NovaCamadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaCamadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaCamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
