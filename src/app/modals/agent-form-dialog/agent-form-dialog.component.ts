import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAgent } from '../../interfaces/agent.interface';
import { SharedMaterialModule } from '../../util/shared-material.module';

export interface AgentDialogData {
  mode: 'create' | 'edit';
  agent?: IAgent;
}

@Component({
  selector: 'app-agent-form-dialog',
  imports: [SharedMaterialModule, ReactiveFormsModule],
  templateUrl: './agent-form-dialog.component.html',
  styleUrl: './agent-form-dialog.component.scss',
})
export class AgentFormDialogComponent implements OnInit {
  agentForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgentDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.agentForm = this.fb.group({
      name: [
        this.data.agent?.name || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z\s'-]+$/), 
        ],
      ],
      commissionPercentage: [
        this.data.agent?.commissionPercentage || 0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(/^\d+(\.\d{1,2})?$/), 
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.agentForm.valid) {
      const formValue = this.agentForm.value;

      const agentData: IAgent = {
        name: formValue.name.trim(),
        commissionPercentage: Number(formValue.commissionPercentage),
      };

      this.dialogRef.close(agentData);
    } else {
      Object.keys(this.agentForm.controls).forEach((key) => {
        this.agentForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get nameControl() {
    return this.agentForm.get('name');
  }

  get commissionControl() {
    return this.agentForm.get('commissionPercentage');
  }

  getNameErrorMessage(): string {
    const control = this.nameControl;
    if (control?.hasError('required')) {
      return 'Agent name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Name must be at least 2 characters long';
    }
    if (control?.hasError('maxlength')) {
      return 'Name cannot exceed 100 characters';
    }
    if (control?.hasError('pattern')) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  }

  getCommissionErrorMessage(): string {
    const control = this.commissionControl;
    if (control?.hasError('required')) {
      return 'Commission percentage is required';
    }
    if (control?.hasError('min')) {
      return 'Commission cannot be negative';
    }
    if (control?.hasError('max')) {
      return 'Commission cannot exceed 100%';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid percentage (up to 2 decimal places)';
    }
    return '';
  }
}
