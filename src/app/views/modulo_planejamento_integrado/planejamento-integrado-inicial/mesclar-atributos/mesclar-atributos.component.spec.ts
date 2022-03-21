import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesclarAtributosComponent } from './mesclar-atributos.component';

describe('MesclarAtributosComponent', () => {
  let component: MesclarAtributosComponent;
  let fixture: ComponentFixture<MesclarAtributosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesclarAtributosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesclarAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
