import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoMetasComponent } from './plano-metas.component';

describe('PlanoMetasComponent', () => {
  let component: PlanoMetasComponent;
  let fixture: ComponentFixture<PlanoMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
