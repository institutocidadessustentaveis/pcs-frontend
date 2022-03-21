import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeCadastroFormComponent } from './shape-cadastro-form.component';

describe('ShapeCadastroFormComponent', () => {
  let component: ShapeCadastroFormComponent;
  let fixture: ComponentFixture<ShapeCadastroFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeCadastroFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeCadastroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
