import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IProgram } from '../../interfaces/program.interface';
import { ProgramsService } from '../../services/programs.service';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrderComponent } from '../../modals/create-order/create-order.component';

@Component({
  selector: 'app-order-advertising',
  imports: [SharedMaterialModule, FormsModule],
  templateUrl: './order-advertising.component.html',
  styleUrl: './order-advertising.component.scss',
})
export class OrderAdvertisingComponent implements OnInit, OnDestroy {
  public programs: IProgram[] = [];
  public dataSource = new MatTableDataSource<IProgram>(this.programs);
  public isLoading = false;
  private programsSub: Subscription | undefined;

  // pagination
  public totalPrograms = 0;
  public programsPerPage = 5;
  public pageSizeOptions = [5, 10, 20];
  public currentPage = 1;

  displayedColumns: string[] = [
    'name',
    'rating',
    'costPeerMinute',
    'calculator',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly _matDialog: MatDialog,
    private programsService: ProgramsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.programsService.getPrograms(this.programsPerPage, this.currentPage);
    this.programsSub = this.programsService
      .getProgramsUpdateListener()
      .subscribe(
        (programData: { programs: IProgram[]; programCount: number }) => {
          this.isLoading = false;

		  this.programs = programData.programs.map((program) => ({
            ...program,
            calculatorMinutes: undefined,
            calculatedCost: 0,
          }));
          this.totalPrograms = programData.programCount;
          this.dataSource.data = this.programs;
        }
      );
  }

  ngOnDestroy() {
    this.programsSub?.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.programsPerPage = pageData.pageSize;
    this.programsService.getPrograms(this.programsPerPage, this.currentPage);
  }

  calculatePrice(program: any) {
    if (program.calculatorMinutes && program.calculatorMinutes > 0) {
      program.calculatedCost =
        program.calculatorMinutes * program.costPeerMinute;
    } else {
      program.calculatedCost = 0;
    }
  }

  openOrderModal(program: IProgram) {
    const dialogRef = this._matDialog.open(CreateOrderComponent, {
      width: '600px',
      data: program,
    });

    dialogRef.afterClosed().subscribe((result: IProgram | undefined) => {
      if (result) {
        this.isLoading = false;
      }
    });
  }
}
