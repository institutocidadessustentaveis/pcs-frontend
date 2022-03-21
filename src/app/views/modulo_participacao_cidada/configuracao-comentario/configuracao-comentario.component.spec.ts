import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoComentarioComponent } from './configuracao-comentario.component';

describe('ConfiguracaoComentarioComponent', () => {
  let component: ConfiguracaoComentarioComponent;
  let fixture: ComponentFixture<ConfiguracaoComentarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracaoComentarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracaoComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
