import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { IProgram } from '../../interfaces/program.interface';
import { ProgramsService } from '../../services/programs.service';

@Component({
  selector: 'app-create-program',
  imports: [SharedMaterialModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './create-program.component.html',
  styleUrl: './create-program.component.scss',
})
export class CreateProgramComponent {
  public programForm!: FormGroup;
  private dialogRef!: MatDialogRef<CreateProgramComponent>;

  constructor(
    private fb: FormBuilder,
    private programsService: ProgramsService
  ) {
    this.programForm = this.fb.group({
      name: ['', Validators.required],
      rating: [
        null,
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
      costPeerMinute: [null, [Validators.required, Validators.min(0)]],
    });
  }

  submit() {
    if (this.programForm.valid) {
      const data: any = {
        id: null,
        name: this.programForm.value.name,
        rating: this.programForm.value.rating,
        costPeerMinute: this.programForm.value.costPeerMinute,
      };
      this.programsService.addProgram(
        data.name,
        data.rating,
        data.costPeerMinute
      );
      this.dialogRef.close(data);
    } else {
      // Optionally mark all fields as touched to show validation errors
      this.programForm.markAllAsTouched();
    }
  }

  closeDialog() {
    // TODO: Add 'Are you sure?' dialog before closing, for now we can use mat-dialog-close
  }
}
