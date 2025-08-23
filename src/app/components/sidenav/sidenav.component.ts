import { Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { RouterModule } from '@angular/router';

type NavObject = { name: string; link: string };

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [SharedMaterialModule, RouterModule],
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Input() navObjects!: NavObject[];
  public showFiller = true;

  private iconMap: { [key: string]: string } = {
    Dashboard: 'description',
    'TV Programs': 'tv',
    Programs: 'tv',
    Clients: 'people',
    Customers: 'people',
    Advertisements: 'event',
    Agents: 'person',
    Settings: 'settings',
    Reports: 'assessment',
    Analytics: 'analytics',
    Profile: 'account_circle',
    Help: 'help',
    Logout: 'exit_to_app',
  };

  trackByFn(index: number, item: NavObject): string {
    return item.link; 
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  getIconForNavItem(navItemName: string): string {
    return this.iconMap[navItemName] || 'radio_button_unchecked';
  }
}
