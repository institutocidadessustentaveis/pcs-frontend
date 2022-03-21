import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EixosPcsComponent } from './eixos-pcs.component';

describe('EixosPcsComponent', () => {
  let component: EixosPcsComponent;
  let fixture: ComponentFixture<EixosPcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EixosPcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EixosPcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
