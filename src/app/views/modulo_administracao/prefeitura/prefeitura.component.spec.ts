import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefeituraComponent } from './prefeitura.component';

describe('PrefeituraComponent', () => {
  let component: PrefeituraComponent;
  let fixture: ComponentFixture<PrefeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
