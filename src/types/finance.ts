export type ExpenseCategory = 
  | 'construction' 
  | 'equipment' 
  | 'permits' 
  | 'labor' 
  | 'materials' 
  | 'utilities' 
  | 'professional_services' 
  | 'marketing' 
  | 'other';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;
  projectId: string;
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: Date;
  paidDate?: Date;
  invoiceNumber?: string;
  vendorName: string;
  vendorContact?: string;
  attachments: string[]; // Receipt/invoice URLs
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  projectId: string;
  name: string;
  totalAmount: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  category: ExpenseCategory;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
}

export interface Investment {
  id: string;
  investorId: string;
  investorName: string;
  amount: number;
  investmentDate: Date;
  expectedROI: number;
  actualROI?: number;
  notes?: string;
  status: 'committed' | 'received' | 'returned';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialReportData {
  summary?: {
    totalBudget: number;
    spentAmount: number;
    remainingBudget: number;
  };
  expenses?: Expense[];
  budgetBreakdown?: BudgetCategory[];
  cashFlow?: CashFlowProjection[];
  [key: string]: unknown;
}

export interface FinancialReport {
  id: string;
  reportType: 'budget_summary' | 'expense_report' | 'roi_analysis' | 'cash_flow';
  projectId: string;
  generatedBy: string;
  generatedDate: Date;
  data: FinancialReportData;
  filters: ReportFilters;
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  categories?: ExpenseCategory[];
  status?: ExpenseStatus[];
  projectIds?: string[];
}

export interface CashFlowProjection {
  month: string;
  projectedIncome: number;
  projectedExpenses: number;
  actualIncome: number;
  actualExpenses: number;
  variance: number;
}