import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrderAdvertisingService } from '../../services/order-advertising.service';
import { IAdvertisingOrder } from '../../interfaces/advertising-order';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../util/shared-material.module';

@Component({
  selector: 'app-my-orders',
  imports: [SharedMaterialModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  public myOrders: IAdvertisingOrder[] = [];
  public dataSource = new MatTableDataSource<IAdvertisingOrder>(this.myOrders);
  public isLoading = false;
  private ordersSub: Subscription | undefined;

  // Pagination
  public totalOrders = 0;
  public ordersPerPage = 5;
  public pageSizeOptions = [5, 10, 20];
  public currentPage = 1;

  displayedColumns: string[] = [
    'program',
    'organizationName',
    'duration',
    'totalPrice',
    'date',
    'status',
    'createdAt',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderAdvertisingService: OrderAdvertisingService) {}

  ngOnInit(): void {
    this.loadMyOrders();
    this.setupOrdersSubscription();
  }

  ngOnDestroy(): void {
    this.ordersSub?.unsubscribe();
  }

  private loadMyOrders(): void {
    this.isLoading = true;
    this.orderAdvertisingService.getUserAdvertisingOrders(
      this.ordersPerPage,
      this.currentPage
    );
  }

  private setupOrdersSubscription(): void {
    this.ordersSub = this.orderAdvertisingService
      .getOrdersUpdateListener()
      .subscribe(
        (orderData: { orders: IAdvertisingOrder[]; orderCount: number }) => {
          this.isLoading = false;
          this.myOrders = orderData.orders;
          this.totalOrders = orderData.orderCount;
          this.dataSource.data = this.myOrders;
          //   console.log('My orders', this.myOrders); // Debug log
        }
      );
  }

  onChangedPage(pageData: PageEvent): void {
    console.log('Page changed:', pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.ordersPerPage = pageData.pageSize;
    this.orderAdvertisingService.getUserAdvertisingOrders(
      this.ordersPerPage,
      this.currentPage
    );
  }
}
