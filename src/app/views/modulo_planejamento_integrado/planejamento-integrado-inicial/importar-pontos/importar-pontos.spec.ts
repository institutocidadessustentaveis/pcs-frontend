import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarPontosComponent } from './importar-pontos.component';

describe('ImportarPontosComponent', () => {
  let component: ImportarPontosComponent;
  let fixture: ComponentFixture<ImportarPontosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarPontosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarPontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
