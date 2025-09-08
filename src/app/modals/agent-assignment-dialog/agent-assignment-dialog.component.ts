import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentService } from '../../services/agent.service';
import { IAgent } from '../../interfaces/agent.interface';
import { IAdvertisingOrder } from '../../interfaces/advertising-order';
import { SharedMaterialModule } from '../../util/shared-material.module';

export interface AgentAssignmentDialogData {
  advertisement: IAdvertisingOrder;
}

@Component({
  selector: 'app-agent-assignment-dialog',
  imports: [SharedMaterialModule, ReactiveFormsModule],
  templateUrl: './agent-assignment-dialog.component.html',
  styleUrl: './agent-assignment-dialog.component.scss',
})
export class AgentAssignmentDialogComponent implements OnInit {
  assignmentForm!: FormGroup;
  availableAgents: IAgent[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private dialogRef: MatDialogRef<AgentAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgentAssignmentDialogData
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAvailableAgents();
  }

  private initializeForm(): void {
    this.assignmentForm = this.fb.group({
      agentId: [this.data.advertisement.agentId || '', Validators.required],
    });
  }

  private loadAvailableAgents(): void {
    this.isLoading = true;
    this.agentService.getAgents(100, 1);

    this.agentService.getAgentsUpdateListener().subscribe(
      (agentData) => {
        this.availableAgents = agentData.agents;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading agents:', error);
        this.isLoading = false;
      }
    );
  }

  onAssign(): void {
    if (this.assignmentForm.valid) {
      const selectedAgentId = this.assignmentForm.value.agentId;
      const selectedAgent = this.availableAgents.find(
        (agent) => agent._id === selectedAgentId
      );

      if (selectedAgent) {
        const result = {
          agentId: selectedAgentId,
          agentName: selectedAgent.name,
          agentCommission: selectedAgent.commissionPercentage,
          agentEarnings:
            (this.data.advertisement.totalPrice *
              selectedAgent.commissionPercentage) /
            100,
        };

        this.dialogRef.close(result);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  calculateEarnings(agentId: string): number {
    const agent = this.availableAgents.find((a) => a._id === agentId);
    if (agent && this.data.advertisement.totalPrice) {
      return (
        (this.data.advertisement.totalPrice * agent.commissionPercentage) / 100
      );
    }
    return 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  getSelectedAgentCommission(): number | null {
    const agentId = this.assignmentForm.get('agentId')?.value;
    const agent = this.availableAgents.find((a) => a._id === agentId);
    return agent ? agent.commissionPercentage : null;
  }
}
