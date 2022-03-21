import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesCadastradosPrefeituraComponent } from './shapes-cadastrados-prefeitura.component';

describe('ShapesCadastradosPrefeituraComponent', () => {
  let component: ShapesCadastradosPrefeituraComponent;
  let fixture: ComponentFixture<ShapesCadastradosPrefeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapesCadastradosPrefeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapesCadastradosPrefeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
