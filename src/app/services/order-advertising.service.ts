import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getOrdersUpdateListener(): Observable<{ orders: IAdvertisingOrder[], orderCount: number }> {
    return this.ordersUpdated.asObservable();
  }
}