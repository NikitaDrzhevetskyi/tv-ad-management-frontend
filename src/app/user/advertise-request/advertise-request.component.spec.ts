import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiseRequestComponent } from './advertise-request.component';

describe('AdvertiseRequestComponent', () => {
  let component: AdvertiseRequestComponent;
  let fixture: ComponentFixture<AdvertiseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertiseRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertiseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
