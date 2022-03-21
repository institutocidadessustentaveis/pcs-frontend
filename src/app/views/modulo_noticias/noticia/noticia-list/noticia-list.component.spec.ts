import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaListComponent } from './noticia-list.component';

describe('NoticiaListComponent', () => {
  let component: NoticiaListComponent;
  let fixture: ComponentFixture<NoticiaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
