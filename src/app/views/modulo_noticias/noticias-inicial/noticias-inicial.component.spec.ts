import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasInicialComponent } from './noticias-inicial.component';

describe('NoticiasInicialComponent', () => {
  let component: NoticiasInicialComponent;
  let fixture: ComponentFixture<NoticiasInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiasInicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
