export interface IProgram {
  id: string | null;
  name: string;
  rating: number;
  costPeerMinute: number;
  calculatorMinutes?: number;  
  calculatedCost?: number;  
}