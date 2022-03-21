import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovacaoPrefeituraComponent } from './aprovacao-prefeitura.component';

describe('AprovacaoPrefeituraComponent', () => {
  let component: AprovacaoPrefeituraComponent;
  let fixture: ComponentFixture<AprovacaoPrefeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprovacaoPrefeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprovacaoPrefeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
