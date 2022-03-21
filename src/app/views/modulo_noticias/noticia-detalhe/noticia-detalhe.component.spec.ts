import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaDetalheComponent } from './noticia-detalhe.component';

describe('NoticiaDetalheComponent', () => {
  let component: NoticiaDetalheComponent;
  let fixture: ComponentFixture<NoticiaDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
