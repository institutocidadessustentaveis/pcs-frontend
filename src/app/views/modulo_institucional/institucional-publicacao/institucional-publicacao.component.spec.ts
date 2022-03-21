import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionalPublicacaoComponent } from './institucional-publicacao.component';

describe('InstitucionalPublicacaoComponent', () => {
  let component: InstitucionalPublicacaoComponent;
  let fixture: ComponentFixture<InstitucionalPublicacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucionalPublicacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionalPublicacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
