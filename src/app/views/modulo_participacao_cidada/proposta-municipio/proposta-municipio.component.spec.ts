import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropostaMunicipioComponent } from './proposta-municipio.component';

describe('PropostaMunicipioComponent', () => {
  let component: PropostaMunicipioComponent;
  let fixture: ComponentFixture<PropostaMunicipioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropostaMunicipioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropostaMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
