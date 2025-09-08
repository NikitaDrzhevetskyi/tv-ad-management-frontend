import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderAdvertisingService } from '../../services/order-advertising.service';
import { IAdvertisingOrder } from '../../interfaces/advertising-order';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-advertisements',
  imports: [SharedMaterialModule],
  templateUrl: './advertisements.component.html',
  styleUrl: './advertisements.component.scss',
})
export class AdvertisementsComponent implements OnInit, OnDestroy {
  public advertisements: IAdvertisingOrder[] = [];
  public dataSource = new MatTableDataSource<IAdvertisingOrder>(
    this.advertisements
  );
  public isLoading = false;
  private ordersSub: Subscription | undefined;

  // Pagination
  public totalOrders = 0;
  public ordersPerPage = 5;
  public pageSizeOptions = [5, 10, 20];
  public currentPage = 1;

  displayedColumns: string[] = [
    'createdAt',
    'date',
    'organizationName',
    'contactPerson',
    'phoneNumber',
    'program',
    'duration',
    'totalPrice',
    'bankDetails',
    'status',
    'agent',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private orderAdvertisingService: OrderAdvertisingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllAdvertisements();
    this.setupOrdersSubscription();
  }

  ngOnDestroy(): void {
    this.ordersSub?.unsubscribe();
  }

  private loadAllAdvertisements(): void {
    this.isLoading = true;
    this.orderAdvertisingService.getAdvertisingOrders(
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
          this.advertisements = orderData.orders;
          this.totalOrders = orderData.orderCount;
          this.dataSource.data = this.advertisements;
          console.log('All advertisements loaded:', this.advertisements);
        },
        (error) => {
          this.isLoading = false;
          //   console.error('Error loading advertisements:', error);
          this.snackBar.open('Failed to load advertisements', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  onChangedPage(pageData: PageEvent): void {
    // console.log('Page changed:', pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.ordersPerPage = pageData.pageSize;
    this.orderAdvertisingService.getAdvertisingOrders(
      this.ordersPerPage,
      this.currentPage
    );
  }

  onUpdateStatus(orderId: string, newStatus: string): void {
    this.orderAdvertisingService
      .updateOrderStatus(orderId, newStatus)
      .subscribe(
        (response) => {
          this.snackBar.open('Status updated successfully', 'Close', {
            duration: 3000,
          });
          // Reload the current page to reflect changes
          this.loadAllAdvertisements();
        },
        (error) => {
          console.error('Error updating status:', error);
          this.snackBar.open('Failed to update status', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  onDeleteAdvertisement(orderId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this advertisement?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderAdvertisingService.deleteAdvertisingOrder(orderId).subscribe(
          () => {
            this.snackBar.open('Advertisement deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadAllAdvertisements();
          },
          (error) => {
            console.error('Error deleting advertisement:', error);
            this.snackBar.open('Failed to delete advertisement', 'Close', {
              duration: 3000,
            });
          }
        );
      }
    });
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
