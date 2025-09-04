import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdvertisingComponent } from './order-advertising.component';

describe('OrderAdvertisingComponent', () => {
  let component: OrderAdvertisingComponent;
  let fixture: ComponentFixture<OrderAdvertisingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAdvertisingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAdvertisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
