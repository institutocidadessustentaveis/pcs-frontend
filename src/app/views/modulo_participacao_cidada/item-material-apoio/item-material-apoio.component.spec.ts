import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaterialApoioComponent } from './item-material-apoio.component';

describe('ItemMaterialApoioComponent', () => {
  let component: ItemMaterialApoioComponent;
  let fixture: ComponentFixture<ItemMaterialApoioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaterialApoioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaterialApoioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
