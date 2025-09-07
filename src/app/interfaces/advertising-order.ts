export interface IAdvertisingOrder {
  _id?: string;
  program: string;
  rating: number;
  pricePerMinute: number;
  duration: number;
  totalPrice: number;
  date: string;
  organizationName: string;
  contactPerson: string;
  bankDetails: string;
  phoneNumber: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}
