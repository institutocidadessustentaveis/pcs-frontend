import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialApoioDetalheComponent } from './material-apoio-detalhe.component';

describe('MaterialApoioDetalheComponent', () => {
  let component: MaterialApoioDetalheComponent;
  let fixture: ComponentFixture<MaterialApoioDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialApoioDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialApoioDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
