export interface IAgent {
  _id?: string;
  name: string;
  commissionPercentage: number;
  totalDealValue?: number;
  totalEarned?: number;
  createdAt?: Date;
  updatedAt?: Date;
}