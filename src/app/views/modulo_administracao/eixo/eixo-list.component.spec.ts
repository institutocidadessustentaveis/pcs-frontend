import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EixoListComponent } from './eixo-list.component';

describe('EixoComponent', () => {
  let component: EixoListComponent;
  let fixture: ComponentFixture<EixoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EixoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EixoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
