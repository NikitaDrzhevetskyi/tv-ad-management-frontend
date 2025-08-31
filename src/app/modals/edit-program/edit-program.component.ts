import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { IProgram } from '../../interfaces/program.interface';
import { ProgramsService } from '../../services/programs.service';

@Component({
  selector: 'app-edit-program',
  imports: [SharedMaterialModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss',
})
export class EditProgramComponent {
  public programForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private programsService: ProgramsService,
    private dialogRef: MatDialogRef<EditProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProgram
  ) {
    this.programForm = this.fb.group({
      name: [data.name || '', Validators.required],
      rating: [
        data.rating || null,
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
      costPeerMinute: [
        data.costPeerMinute || null,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  submit() {
    if (this.programForm.valid) {
      const updatedProgram: IProgram = {
        id: this.data.id,
        name: this.programForm.value.name,
        rating: this.programForm.value.rating,
        costPeerMinute: this.programForm.value.costPeerMinute,
      };

      this.dialogRef.close(updatedProgram);
    } else {
      this.programForm.markAllAsTouched();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
