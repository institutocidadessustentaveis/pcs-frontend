import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoMetasDetalhesComponent } from './plano-metas-detalhes.component';

describe('PlanoMetasDetalhesComponent', () => {
  let component: PlanoMetasDetalhesComponent;
  let fixture: ComponentFixture<PlanoMetasDetalhesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoMetasDetalhesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoMetasDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
