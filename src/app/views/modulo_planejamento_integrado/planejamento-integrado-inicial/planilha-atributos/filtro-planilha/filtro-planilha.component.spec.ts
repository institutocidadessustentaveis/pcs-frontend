import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroPlanilhaComponent } from './filtro-planilha.component';

describe('FiltroPlanilhaComponent', () => {
  let component: FiltroPlanilhaComponent;
  let fixture: ComponentFixture<FiltroPlanilhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroPlanilhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroPlanilhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
