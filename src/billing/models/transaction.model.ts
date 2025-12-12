export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'successful' | 'pending' | 'failed';
  description: string;
  category: string;
  paymentMethod: string;
}

export interface TransactionFilters {
  status?: string;
  category?: string;
};

