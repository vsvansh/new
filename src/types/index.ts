
export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export type ExpenseCategory = 
  | 'accommodation' 
  | 'transportation' 
  | 'food' 
  | 'activities' 
  | 'shopping' 
  | 'emergency' 
  | 'miscellaneous';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  currency: string;
  convertedAmount?: number;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  notes?: string;
  assignedTo?: string;
  location?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  budget: number;
  companions: string[];
  expenses: Expense[];
}

export interface DailyBudget {
  date: string;
  budget: number;
  spent: number;
  remaining: number;
}

export interface CategoryTotal {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageSpent: number;
  categorySummary: CategoryTotal[];
  dailyAverage: number;
  highestCategory: CategoryTotal;
}
