export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface Subcategory {
  id: string;
  parentId: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  categoryId: string;
  subcategoryId: string;
  description: string;
  type: TransactionType;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  balance: number;
}
