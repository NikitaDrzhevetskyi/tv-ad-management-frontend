import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RouterLink } from '@angular/router';
import { SharedMaterialModule } from './util/shared-material.module';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    SharedMaterialModule,
    SidenavComponent,
  ],
})
export class AppComponent {
  public title = 'tv-ad-management-frontend';
}
