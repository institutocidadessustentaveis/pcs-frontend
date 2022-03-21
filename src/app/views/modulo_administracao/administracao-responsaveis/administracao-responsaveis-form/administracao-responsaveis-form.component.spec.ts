import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracaoResponsaveisFormComponent } from './administracao-responsaveis-form.component';

describe('AdministracaoResponsaveisFormComponent', () => {
  let component: AdministracaoResponsaveisFormComponent;
  let fixture: ComponentFixture<AdministracaoResponsaveisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracaoResponsaveisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoResponsaveisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
