import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IProgram } from '../../interfaces/program.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { c } from '../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh';
import { MatDialog } from '@angular/material/dialog';
import { CreateProgramComponent } from '../../modals/create-program/create-program.component';
import { ProgramsService } from '../../services/programs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss'],
})
export class ProgramsComponent implements AfterViewInit {
  public programs: IProgram[] = [];
  private programsSub: Subscription | undefined;

  dataSource = new MatTableDataSource<IProgram>();
  displayedColumns: string[] = ['name', 'rating', 'costPeerMinute', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly _matDialog: MatDialog,
    private programsService: ProgramsService
  ) {}

  ngOnInit() {
    this.programsService.getPrograms();
    this.programsSub = this.programsService
      .getProgramsUpdateListener()
      .subscribe((programs: IProgram[]) => {
        this.programs = programs;
        this.dataSource.data = programs; 
      });
  }

  ngOnDestroy() {
    this.programsSub?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
        }
      });
  }

  editProgram(program: IProgram) {
    console.log('Edit program:', program);
  }

  onDelete(programId: string) {
    this.programsService.deleteProgram(programId);
  }

  updateProgram() {}
}
