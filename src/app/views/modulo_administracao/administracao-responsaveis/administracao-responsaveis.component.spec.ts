import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracaoResponsaveisComponent } from './administracao-responsaveis.component';

describe('AdministracaoResponsaveisComponent', () => {
  let component: AdministracaoResponsaveisComponent;
  let fixture: ComponentFixture<AdministracaoResponsaveisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracaoResponsaveisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoResponsaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
