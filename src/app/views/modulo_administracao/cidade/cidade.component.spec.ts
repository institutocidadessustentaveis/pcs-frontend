import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadeComponent } from './cidade.component';

describe('CidadeComponent', () => {
  let component: CidadeComponent;
  let fixture: ComponentFixture<CidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
