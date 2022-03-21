import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioBoletimComponent } from './envio-boletim.component';

describe('EnvioBoletimComponent', () => {
  let component: EnvioBoletimComponent;
  let fixture: ComponentFixture<EnvioBoletimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvioBoletimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioBoletimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
