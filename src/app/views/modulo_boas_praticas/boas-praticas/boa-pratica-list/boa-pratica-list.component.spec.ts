import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoaPraticaListComponent } from './boa-pratica-list.component';

describe('BoaPraticaListComponent', () => {
  let component: BoaPraticaListComponent;
  let fixture: ComponentFixture<BoaPraticaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoaPraticaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoaPraticaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
