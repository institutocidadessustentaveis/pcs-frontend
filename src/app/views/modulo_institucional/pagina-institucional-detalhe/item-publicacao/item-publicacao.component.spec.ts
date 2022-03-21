import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPublicacaoComponent } from './item-publicacao.component';

describe('ItemPublicacaoComponent', () => {
  let component: ItemPublicacaoComponent;
  let fixture: ComponentFixture<ItemPublicacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPublicacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPublicacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
