// sidenav.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

interface NavigationItem {
  name: string;
  link: string;
  icon?: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedMaterialModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public currentUser: any = null;
  public navigationItems: NavigationItem[] = [];

  private destroy$ = new Subject<void>();

  private adminNavigation: NavigationItem[] = [
    { name: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
    { name: 'Programs', link: '/programs', icon: 'tv' },
    { name: 'Customers', link: '/customers', icon: 'people' },
    { name: 'Agents', link: '/agents', icon: 'support_agent' },
    { name: 'Advertisements', link: '/advertisements', icon: 'campaign' },
  ];

  private userNavigation: NavigationItem[] = [
    {
      name: 'Order Advertising',
      link: '/order-advertising',
      icon: 'add_business',
    },
    { name: 'Profile', link: '/user-profile', icon: 'person' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
        if (!isAuth) {
          this.navigationItems = [];
        }
      });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        this.updateNavigation();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateNavigation(): void {
    if (!this.currentUser) {
      this.navigationItems = [];
      return;
    }

    switch (this.currentUser.role) {
      case 'admin':
        this.navigationItems = [...this.adminNavigation];
        break;
      case 'user':
        this.navigationItems = [...this.userNavigation];
        break;
      default:
        this.navigationItems = [];
        break;
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  getUserDisplayName(): string {
    return this.currentUser?.email || 'User';
  }

  getUserRole(): string {
    if (!this.currentUser) return '';

    return this.currentUser.role === 'admin' ? 'Administrator' : 'User';
  }
}
