import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSubdivisaoComponent } from './tipo-subdivisao.component';

describe('TipoSubdivisaoComponent', () => {
  let component: TipoSubdivisaoComponent;
  let fixture: ComponentFixture<TipoSubdivisaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSubdivisaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSubdivisaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
