import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoDeMetasComponent } from './plano-de-metas.component';

describe('PlanoDeMetasComponent', () => {
  let component: PlanoDeMetasComponent;
  let fixture: ComponentFixture<PlanoDeMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoDeMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoDeMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
