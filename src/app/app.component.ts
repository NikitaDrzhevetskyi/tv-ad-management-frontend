import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SidenavComponent } from './components/sidenav/sidenav.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [SidenavComponent, RouterOutlet, MatSlideToggleModule],
})
export class AppComponent {
  public title = 'tv-ad-management-frontend';

  public siteMap = [
    {
      name: 'Dashboard',
      link: 'dashboard',
    },
    {
      name: 'Customers',
      link: 'customers',
    },
    {
      name: 'Programs',
      link: 'programs',
    },
    {
      name: 'Agents',
      link: 'agents',
    },
    {
      name: 'Advertisements',
      link: 'advertisements',
    },
  ];
}
