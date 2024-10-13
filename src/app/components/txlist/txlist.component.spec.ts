import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxlistComponent } from './txlist.component';

describe('TxlistComponent', () => {
  let component: TxlistComponent;
  let fixture: ComponentFixture<TxlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TxlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
