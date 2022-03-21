import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeCadastroListComponent } from './shape-cadastro-list.component';

describe('ShapeCadastroListComponent', () => {
  let component: ShapeCadastroListComponent;
  let fixture: ComponentFixture<ShapeCadastroListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeCadastroListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeCadastroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
