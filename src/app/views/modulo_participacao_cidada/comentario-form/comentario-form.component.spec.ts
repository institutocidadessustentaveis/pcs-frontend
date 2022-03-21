import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentarioFormComponent } from './comentario-form.component';

describe('ComentarioFormComponent', () => {
  let component: ComentarioFormComponent;
  let fixture: ComponentFixture<ComentarioFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComentarioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
