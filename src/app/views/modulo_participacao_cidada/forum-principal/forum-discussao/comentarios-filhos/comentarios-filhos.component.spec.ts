import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosFilhosComponent } from './comentarios-filhos.component';

describe('ComentariosFilhosComponent', () => {
  let component: ComentariosFilhosComponent;
  let fixture: ComponentFixture<ComentariosFilhosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComentariosFilhosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentariosFilhosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
