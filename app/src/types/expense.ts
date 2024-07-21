export interface Expense {
  amount: number;
  pubKey: string;
  merchant: string;
  id: number;
  prediction: string; // New field for prediction
}
