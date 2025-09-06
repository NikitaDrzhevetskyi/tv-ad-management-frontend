import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { IProgram } from '../../interfaces/program.interface';
import { ProgramsService } from '../../services/programs.service';
import { IAdvertisingOrder } from '../../interfaces/advertising-order';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderAdvertisingService } from '../../services/order-advertising.service'; // Add this import

@Component({
  selector: 'app-create-order',
  imports: [
    SharedMaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent {
  public orderForm!: FormGroup;
  public today: string = new Date().toISOString().split('T')[0];
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private programsService: ProgramsService,
    private orderAdvertisingService: OrderAdvertisingService,
    private snackBar: MatSnackBar, // Add this service
    private dialogRef: MatDialogRef<CreateOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProgram
  ) {
    this.initializeForm();
    this.setupDurationChangeListener();
  }

  private initializeForm() {
    this.orderForm = this.fb.group({
      program: new FormControl(
        { value: this.data.name || '', disabled: true },
        Validators.required
      ),
      rating: new FormControl(
        { value: this.data.rating || 0, disabled: true },
        Validators.required
      ),
      pricePerMinute: new FormControl(
        { value: this.data.costPeerMinute || 0, disabled: true },
        Validators.required
      ),
      duration: new FormControl(this.data.calculatorMinutes || 0, [
        Validators.required,
        Validators.min(1),
      ]),
      totalPrice: new FormControl({
        value: this.calculateTotalPrice(),
        disabled: true,
      }),
      date: new FormControl(new Date(), Validators.required),
      totalCost: new FormControl({
        value: this.calculateTotalPrice(),
        disabled: true,
      }),
      organizationName: new FormControl('', Validators.required),
      contactPerson: new FormControl('', Validators.required),
      bankDetails: new FormControl('', Validators.required),
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private setupDurationChangeListener() {
    this.orderForm
      .get('duration')
      ?.valueChanges.subscribe((duration: number) => {
        const totalPrice = this.calculateTotalPrice(duration);
        this.orderForm.patchValue(
          {
            totalPrice: totalPrice,
            totalCost: totalPrice,
          },
          { emitEvent: false }
        );
      });
  }

  private calculateTotalPrice(duration?: number): number {
    const durationValue =
      duration ?? this.orderForm?.get('duration')?.value ?? 0;
    const pricePerMinute = this.data.costPeerMinute ?? 0;
    return durationValue * pricePerMinute;
  }

  public getTotalPrice(): number {
    return this.calculateTotalPrice();
  }

  submit() {
    if (this.orderForm.valid && !this.isLoading) {
      this.isLoading = true; // Set loading state
      const formValues = this.orderForm.getRawValue();

      const orderData: IAdvertisingOrder = {
        program: this.data.name || '',
        rating: this.data.rating || 0,
        pricePerMinute: this.data.costPeerMinute || 0,
        duration: formValues.duration ?? 0,
        totalPrice: this.calculateTotalPrice(),
        date: this.formatDate(formValues.date) ?? this.formatDate(new Date()),
        organizationName: formValues.organizationName || '',
        contactPerson: formValues.contactPerson || '',
        bankDetails: formValues.bankDetails || '',
      };

      console.log(orderData);
      // Call the service to create the order
      this.orderAdvertisingService.createAdvertisingOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order submitted successfully:', response);
          this.snackBar.open('Order created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close(response.advertisement);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error submitting order:', error);
          this.snackBar.open(
            error.error?.message || 'Failed to create order. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
          this.isLoading = false;
        },
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
