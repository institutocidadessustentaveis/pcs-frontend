import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BomIndicadorComponent } from './bom-indicador.component';

describe('BomIndicadorComponent', () => {
  let component: BomIndicadorComponent;
  let fixture: ComponentFixture<BomIndicadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomIndicadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
