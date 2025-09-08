import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AgentService } from '../../services/agent.service';
import { IAgent } from '../../interfaces/agent.interface';
import { Subscription } from 'rxjs';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { AgentFormDialogComponent } from '../../modals/agent-form-dialog/agent-form-dialog.component';


@Component({
  selector: 'app-agents',
  imports: [SharedMaterialModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent implements OnInit, OnDestroy {
  public agents: IAgent[] = [];
  public dataSource = new MatTableDataSource<IAgent>(this.agents);
  public isLoading = false;
  private agentsSub: Subscription | undefined;

  // Pagination
  public totalAgents = 0;
  public agentsPerPage = 10;
  public pageSizeOptions = [5, 10, 20];
  public currentPage = 1;

  displayedColumns: string[] = [
    'name',
    'commissionPercentage',
    'totalDealValue',
    'totalEarned',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private agentService: AgentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAgents();
    this.setupAgentsSubscription();
  }

  ngOnDestroy(): void {
    this.agentsSub?.unsubscribe();
  }

  private loadAgents(): void {
    this.isLoading = true;
    this.agentService.getAgents(this.agentsPerPage, this.currentPage);
  }

  private setupAgentsSubscription(): void {
    this.agentsSub = this.agentService.getAgentsUpdateListener().subscribe(
      (agentData: { agents: IAgent[]; agentCount: number }) => {
        this.isLoading = false;
        this.agents = agentData.agents;
        this.totalAgents = agentData.agentCount;
        this.dataSource.data = this.agents;
        console.log('Agents loaded:', this.agents);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading agents:', error);
        this.snackBar.open('Failed to load agents', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  onChangedPage(pageData: PageEvent): void {
    console.log('Page changed:', pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.agentsPerPage = pageData.pageSize;
    this.agentService.getAgents(this.agentsPerPage, this.currentPage);
  }

  onAddAgent(): void {
    const dialogRef = this.dialog.open(AgentFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.agentService.createAgent(result).subscribe(
          (response) => {
            this.snackBar.open('Agent created successfully', 'Close', {
              duration: 3000,
            });
            this.loadAgents();
          },
          (error) => {
            console.error('Error creating agent:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to create agent',
              'Close',
              { duration: 3000 }
            );
          }
        );
      }
    });
  }

  onEditAgent(agent: IAgent): void {
    const dialogRef = this.dialog.open(AgentFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', agent: { ...agent } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && agent._id) {
        this.agentService.updateAgent(agent._id, result).subscribe(
          (response) => {
            this.snackBar.open('Agent updated successfully', 'Close', {
              duration: 3000,
            });
            this.loadAgents();
          },
          (error) => {
            console.error('Error updating agent:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to update agent',
              'Close',
              { duration: 3000 }
            );
          }
        );
      }
    });
  }

  onDeleteAgent(agent: IAgent): void {
    const confirmMessage = `Are you sure you want to delete agent "${agent.name}"? This action cannot be undone.`;

    if (confirm(confirmMessage) && agent._id) {
      this.agentService.deleteAgent(agent._id).subscribe(
        (response) => {
          this.snackBar.open('Agent deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadAgents();
        },
        (error) => {
          console.error('Error deleting agent:', error);
          this.snackBar.open(
            error.error?.message || 'Failed to delete agent',
            'Close',
            { duration: 3000 }
          );
        }
      );
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  }

  formatPercentage(percentage: number): string {
    return `${percentage}%`;
  }
}
