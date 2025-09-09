import { SharedMaterialModule } from '../../util/shared-material.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderAdvertisingService } from '../../services/order-advertising.service';
import { IAdvertisingOrder } from '../../interfaces/advertising-order';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [SharedMaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public isLoadingRevenue = false;
  public totalApprovedRevenue = 0;
  public companyRevenue = 0;
  public agentCommissions = 0;
  public approvedAdsCount = 0;

  private revenueSubscription: Subscription | undefined;

  constructor(private orderAdvertisingService: OrderAdvertisingService) {}

  ngOnInit(): void {
    this.loadRevenueData();
  }

  ngOnDestroy(): void {
    this.revenueSubscription?.unsubscribe();
  }

  private loadRevenueData(): void {
    this.isLoadingRevenue = true;

    this.revenueSubscription = this.orderAdvertisingService
      .getAllApprovedAdvertisements()
      .subscribe(
        (response: { advertisements: IAdvertisingOrder[] }) => {
          this.calculateRevenue(response.advertisements);
          this.isLoadingRevenue = false;
        },
        (error) => {
          console.error('Error loading approved ads revenue:', error);
          this.isLoadingRevenue = false;
        }
      );
  }

  private calculateRevenue(advertisements: IAdvertisingOrder[]): void {
    this.approvedAdsCount = advertisements.length;
    this.totalApprovedRevenue = 0;
    this.agentCommissions = 0;

    advertisements.forEach((ad) => {
      this.totalApprovedRevenue += ad.totalPrice || 0;

      if (ad.agentEarnings) {
        this.agentCommissions += ad.agentEarnings;
      }
    });

    this.companyRevenue = this.totalApprovedRevenue - this.agentCommissions;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  }

  getCompanyRevenuePercentage(): number {
    if (this.totalApprovedRevenue === 0) return 0;
    return (this.companyRevenue / this.totalApprovedRevenue) * 100;
  }

  getAgentCommissionPercentage(): number {
    if (this.totalApprovedRevenue === 0) return 0;
    return (this.agentCommissions / this.totalApprovedRevenue) * 100;
  }
}
