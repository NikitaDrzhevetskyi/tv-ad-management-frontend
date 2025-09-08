import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderAdvertisingService } from '../../services/order-advertising.service';
import { IAdvertisingOrder } from '../../interfaces/advertising-order';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AgentAssignmentDialogComponent } from '../../modals/agent-assignment-dialog/agent-assignment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-advertisements',
  imports: [SharedMaterialModule],
  templateUrl: './advertisements.component.html',
  styleUrl: './advertisements.component.scss',
})
export class AdvertisementsComponent implements OnInit, OnDestroy {
  public advertisements: IAdvertisingOrder[] = [];
  public approvedAdvertisements: IAdvertisingOrder[] = [];
  public dataSource = new MatTableDataSource<IAdvertisingOrder>(this.advertisements);
  public approvedDataSource = new MatTableDataSource<IAdvertisingOrder>(this.approvedAdvertisements);
  public isLoading = false;
  private ordersSub: Subscription | undefined;
  private approvedOrdersSub: Subscription | undefined;
  public selectedTab = 0;
  
  // Pagination for all ads
  public totalOrders = 0;
  public ordersPerPage = 5;
  public pageSizeOptions = [5, 10, 20];
  public currentPage = 1;

  // Pagination for approved ads
  public totalApprovedOrders = 0;
  public approvedOrdersPerPage = 5;
  public currentApprovedPage = 1;

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

  approvedDisplayedColumns: string[] = [
    'createdAt',
    'date',
    'organizationName',
    'contactPerson',
    'program',
    'duration',
    'totalPrice',
    'agent',
    'agentEarnings',
    'status',
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
    this.approvedOrdersSub?.unsubscribe();
  }

  onTabChanged(event: any): void {
    this.selectedTab = event.index;
    if (this.selectedTab === 1) {
      this.loadApprovedAdvertisements();
    }
  }

  private loadAllAdvertisements(): void {
    this.isLoading = true;
    this.orderAdvertisingService.getAdvertisingOrders(
      this.ordersPerPage,
      this.currentPage
    );
  }

  private loadApprovedAdvertisements(): void {
    this.isLoading = true;
    this.orderAdvertisingService.getApprovedAdvertisements(
      this.approvedOrdersPerPage,
      this.currentApprovedPage
    );
  }

  private setupOrdersSubscription(): void {
    this.ordersSub = this.orderAdvertisingService
      .getOrdersUpdateListener()
      .subscribe(
        (orderData: { orders: IAdvertisingOrder[]; orderCount: number }) => {
          this.isLoading = false;
          
          if (this.selectedTab === 0) {
            // All advertisements tab
            this.advertisements = orderData.orders;
            this.totalOrders = orderData.orderCount;
            this.dataSource.data = this.advertisements;
          } else {
            // Approved advertisements tab
            this.approvedAdvertisements = orderData.orders;
            this.totalApprovedOrders = orderData.orderCount;
            this.approvedDataSource.data = this.approvedAdvertisements;
          }
          
          console.log('Advertisements loaded:', orderData.orders);
        },
        (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to load advertisements', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    if (this.selectedTab === 0) {
      this.currentPage = pageData.pageIndex + 1;
      this.ordersPerPage = pageData.pageSize;
      this.orderAdvertisingService.getAdvertisingOrders(
        this.ordersPerPage,
        this.currentPage
      );
    } else {
      this.currentApprovedPage = pageData.pageIndex + 1;
      this.approvedOrdersPerPage = pageData.pageSize;
      this.orderAdvertisingService.getApprovedAdvertisements(
        this.approvedOrdersPerPage,
        this.currentApprovedPage
      );
    }
  }

  onUpdateStatus(orderId: string, newStatus: string): void {
    this.orderAdvertisingService
      .updateOrderStatus(orderId, newStatus)
      .subscribe(
        (response) => {
          this.snackBar.open('Status updated successfully', 'Close', {
            duration: 3000,
          });
          
          if (this.selectedTab === 0) {
            this.loadAllAdvertisements();
          } else {
            this.loadApprovedAdvertisements();
          }
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
            
            // Reload current tab
            if (this.selectedTab === 0) {
              this.loadAllAdvertisements();
            } else {
              this.loadApprovedAdvertisements();
            }
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

  onAssignAgent(advertisement: IAdvertisingOrder): void {
    const dialogRef = this.dialog.open(AgentAssignmentDialogComponent, {
      width: '600px',
      data: { advertisement }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && advertisement._id) {
        this.orderAdvertisingService.assignAgentToAdvertisement(advertisement._id, result).subscribe(
          () => {
            this.snackBar.open('Agent assigned successfully', 'Close', {
              duration: 3000,
            });
            
            // Reload current tab
            if (this.selectedTab === 0) {
              this.loadAllAdvertisements();
            } else {
              this.loadApprovedAdvertisements();
            }
          },
          (error) => {
            console.error('Error assigning agent:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to assign agent', 
              'Close', 
              { duration: 3000 }
            );
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  }

  hasAgent(advertisement: IAdvertisingOrder): boolean {
    return !!advertisement.agentId;
  }

  getAgentButtonText(advertisement: IAdvertisingOrder): string {
    return this.hasAgent(advertisement) ? 'Change Agent' : 'Assign Agent';
  }
}