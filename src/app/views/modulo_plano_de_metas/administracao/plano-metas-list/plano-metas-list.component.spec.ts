import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoMetasListComponent } from './plano-metas-list.component';

describe('PlanoMetasListComponent', () => {
  let component: PlanoMetasListComponent;
  let fixture: ComponentFixture<PlanoMetasListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoMetasListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoMetasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
