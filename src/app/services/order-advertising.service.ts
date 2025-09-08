import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProgram } from '../interfaces/program.interface';
import { IAdvertisingOrder } from '../interfaces/advertising-order';
import { Subject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderAdvertisingService {
  private readonly apiUrl = 'http://localhost:3001/api/advertisements';
  private ordersUpdated = new Subject<{ orders: IAdvertisingOrder[], orderCount: number }>();

  constructor(private http: HttpClient) {}

  // Create new advertising order
  createAdvertisingOrder(orderData: IAdvertisingOrder): Observable<any> {
    return this.http.post<{message: string, advertisement: IAdvertisingOrder}>(
      this.apiUrl, 
      orderData
    ).pipe(
      catchError(error => {
        console.error('Error creating advertising order:', error);
        return throwError(error);
      })
    );
  }

  // Get all orders (admin)
  getAdvertisingOrders(ordersPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${ordersPerPage}&page=${currentPage}`;
    
    this.http.get<{message: string, advertisements: IAdvertisingOrder[], maxAdvertisements: number}>(
      this.apiUrl + queryParams
    ).pipe(
      catchError(error => {
        console.error('Error fetching advertising orders:', error);
        return throwError(error);
      })
    ).subscribe((orderData) => {
      this.ordersUpdated.next({
        orders: orderData.advertisements,
        orderCount: orderData.maxAdvertisements
      });
    });
  }

  // Get approved advertisements only
  getApprovedAdvertisements(ordersPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${ordersPerPage}&page=${currentPage}&status=approved`;
    
    this.http.get<{message: string, advertisements: IAdvertisingOrder[], maxAdvertisements: number}>(
      this.apiUrl + queryParams
    ).pipe(
      catchError(error => {
        console.error('Error fetching approved advertising orders:', error);
        return throwError(error);
      })
    ).subscribe((orderData) => {
      this.ordersUpdated.next({
        orders: orderData.advertisements,
        orderCount: orderData.maxAdvertisements
      });
    });
  }

  // Get user's own orders
  getUserAdvertisingOrders(ordersPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${ordersPerPage}&page=${currentPage}`;
    
    this.http.get<{message: string, advertisements: IAdvertisingOrder[], maxAdvertisements: number}>(
      `${this.apiUrl}/my${queryParams}`
    ).pipe(
      catchError(error => {
        console.error('Error fetching user advertising orders:', error);
        return throwError(error);
      })
    ).subscribe((orderData) => {
      this.ordersUpdated.next({
        orders: orderData.advertisements,
        orderCount: orderData.maxAdvertisements
      });
    });
  }

  // Update order status (admin)
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put<{message: string, advertisement: IAdvertisingOrder}>(
      `${this.apiUrl}/${orderId}/status`,
      { status }
    ).pipe(
      catchError(error => {
        console.error('Error updating order status:', error);
        return throwError(error);
      })
    );
  }

  // Assign agent to advertisement
  assignAgentToAdvertisement(advertisementId: string, agentData: { agentId: string }): Observable<any> {
    return this.http.put<{message: string, advertisement: IAdvertisingOrder}>(
      `${this.apiUrl}/${advertisementId}/agent`,
      agentData
    ).pipe(
      catchError(error => {
        console.error('Error assigning agent to advertisement:', error);
        return throwError(error);
      })
    );
  }

  // Delete order (admin)
  deleteAdvertisingOrder(orderId: string): Observable<any> {
    return this.http.delete<{message: string}>(
      `${this.apiUrl}/${orderId}`
    ).pipe(
      catchError(error => {
        console.error('Error deleting advertising order:', error);
        return throwError(error);
      })
    );
  }

  // Get orders update listener
  getOrdersUpdateListener(): Observable<{ orders: IAdvertisingOrder[], orderCount: number }> {
    return this.ordersUpdated.asObservable();
  }
}