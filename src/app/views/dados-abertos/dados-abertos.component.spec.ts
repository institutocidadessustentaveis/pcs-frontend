import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosAbertosComponent } from './dados-abertos.component';

describe('DadosAbertosComponent', () => {
  let component: DadosAbertosComponent;
  let fixture: ComponentFixture<DadosAbertosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DadosAbertosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosAbertosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
