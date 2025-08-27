import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatTableModule,
    MatNavList,
    MatSliderModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSortModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatTableModule,
    MatNavList,
    MatSliderModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSortModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    MatDividerModule,
  ],
})
export class SharedMaterialModule {}
