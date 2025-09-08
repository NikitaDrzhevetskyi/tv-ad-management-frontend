import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IProgram } from '../../interfaces/program.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { CreateProgramComponent } from '../../modals/create-program/create-program.component';
import { EditProgramComponent } from '../../modals/edit-program/edit-program.component';
import { ProgramsService } from '../../services/programs.service';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { AgentService } from '../../services/agent.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [SharedMaterialModule, ReactiveFormsModule],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss'],
})
export class ProgramsComponent implements OnInit, OnDestroy {
  public programs: IProgram[] = [];
  public dataSource = new MatTableDataSource<IProgram>(this.programs);
  public isLoading = false;
  private programsSub: Subscription | undefined;

  //pagination
  public totalPrograms = 0;
  public programsPerPage = 5;
  public pageSizeOptions = [5, 10, 20];
  public currentPage = 1;

  displayedColumns: string[] = ['name', 'rating', 'costPeerMinute', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly _matDialog: MatDialog,
    private programsService: ProgramsService,
	private agentService: AgentService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.programsService.getPrograms(this.programsPerPage, this.currentPage);
    this.programsSub = this.programsService
      .getProgramsUpdateListener()
      .subscribe(
        (programData: { programs: IProgram[]; programCount: number }) => {
          this.isLoading = false;
          this.programs = programData.programs;
          this.totalPrograms = programData.programCount;
          this.dataSource.data = this.programs;
          //   console.log('Programs received:', this.programs);//debug how much programs we get
        }
      );
  }

  ngOnDestroy() {
    this.programsSub?.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.programsPerPage = pageData.pageSize;
    this.programsService.getPrograms(this.programsPerPage, this.currentPage);
  }

  createProgram() {
    this._matDialog
      .open(CreateProgramComponent, { width: '600px' })
      .afterClosed()
      .subscribe((result: IProgram | undefined) => {
        if (result) {
          this.programsService.addProgram(
            result.name,
            result.rating,
            result.costPeerMinute
          );
          // Refresh the list after adding
          setTimeout(() => {
            this.programsService.getPrograms(
              this.programsPerPage,
              this.currentPage
            );
          }, 100);
        }
      });
  }

  editProgram(program: IProgram) {
    const dialogRef = this._matDialog.open(EditProgramComponent, {
      width: '600px',
      data: program 
    });

    dialogRef.afterClosed().subscribe((result: IProgram | undefined) => {
      if (result) {
        this.isLoading = true;
        
        // Call the backend service to update the program
        this.programsService.updateProgram(
          result.id!,
          result.name,
          result.rating,
          result.costPeerMinute
        ).subscribe({
          next: (response) => {
            console.log('Program updated successfully:', response);
            this.programsService.getPrograms(
              this.programsPerPage,
              this.currentPage
            );
          },
          error: (error) => {
            console.error('Error updating program:', error);
            this.isLoading = false;
          }
        });
      }
    });
  }

  onDelete(programId: string) {
    this.isLoading = true;

    this.programsService.deleteProgram(programId).subscribe(() => {
      this.programsService.getPrograms(this.programsPerPage, this.currentPage);
    });
  }
}