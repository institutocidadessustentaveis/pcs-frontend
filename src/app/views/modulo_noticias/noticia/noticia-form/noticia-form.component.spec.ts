import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaFormComponent } from './noticia-form.component';

describe('NoticiaFormComponent', () => {
  let component: NoticiaFormComponent;
  let fixture: ComponentFixture<NoticiaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
