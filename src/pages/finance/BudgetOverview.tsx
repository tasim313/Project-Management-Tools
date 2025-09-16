import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { FinanceForm } from '@/components/forms/FinanceForm';
import { FinanceService, initializeSampleData } from '@/lib/data-service';
import { FinanceRecord } from '@/types/finance';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetOverview() {
  const [records, setRecords] = React.useState<FinanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = React.useState<FinanceRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadRecords = async () => {
    try {
      setLoading(true);
      await initializeSampleData();
      const allRecords = await FinanceService.getAllRecords();
      setRecords(allRecords);
    } catch (error) {
      console.error('Failed to load finance records:', error);
      toast.error('Failed to load finance records');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadRecords();
  }, []);

  const handleCreateRecord = async (recordData: Omit<FinanceRecord, 'id'>) => {
    try {
      await FinanceService.createRecord(recordData);
      await loadRecords();
      toast.success('Finance record created successfully');
    } catch (error) {
      console.error('Failed to create record:', error);
      toast.error('Failed to create record');
    }
  };

  const handleUpdateRecord = async (recordData: Omit<FinanceRecord, 'id'>) => {
    if (!selectedRecord) return;
    
    try {
      await FinanceService.updateRecord(selectedRecord.id, recordData);
      await loadRecords();
      toast.success('Finance record updated successfully');
    } catch (error) {
      console.error('Failed to update record:', error);
      toast.error('Failed to update record');
    }
  };

  const handleDeleteRecord = async (record: FinanceRecord) => {
    if (!confirm('Are you sure you want to delete this finance record?')) return;
    
    try {
      await FinanceService.deleteRecord(record.id);
      await loadRecords();
      toast.success('Finance record deleted successfully');
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast.error('Failed to delete record');
    }
  };

  const handleEditRecord = (record: FinanceRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  };

  const handleFormSubmit = (recordData: Omit<FinanceRecord, 'id'>) => {
    if (selectedRecord) {
      handleUpdateRecord(recordData);
    } else {
      handleCreateRecord(recordData);
    }
  };

  const columns = [
    {
      key: 'type' as keyof FinanceRecord,
      label: 'Type',
      render: (value: string) => (
        <div className={`flex items-center ${value === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {value === 'income' ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
          {value.toUpperCase()}
        </div>
      )
    },
    {
      key: 'category' as keyof FinanceRecord,
      label: 'Category',
      render: (value: string) => value
    },
    {
      key: 'amount' as keyof FinanceRecord,
      label: 'Amount (BDT)',
      render: (value: number) => (
        <div className="font-medium">
          ৳{value?.toLocaleString() || '0'}
        </div>
      )
    },
    {
      key: 'description' as keyof FinanceRecord,
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate">{value}</div>
      )
    },
    {
      key: 'date' as keyof FinanceRecord,
      label: 'Date',
      render: (value: Date) => (
        <div>{value ? new Date(value).toLocaleDateString() : 'No date'}</div>
      )
    }
  ];

  const financialStats = React.useMemo(() => {
    const totalIncome = records
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const totalExpenses = records
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, netBalance, totalRecords: records.length };
  }, [records]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading finance records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget & Finance</h1>
          <p className="text-muted-foreground">Track income, expenses and budget allocation</p>
        </div>
        <Button onClick={handleAddRecord}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense/Income
        </Button>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{financialStats.totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ৳{financialStats.totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financialStats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ৳{financialStats.netBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialStats.totalRecords}</div>
          </CardContent>
        </Card>
      </div>

      {/* Finance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>
            Create, edit, and manage all income and expense records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={records}
            columns={columns}
            onAdd={handleAddRecord}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            addLabel="Add Record"
          />
        </CardContent>
      </Card>

      {/* Finance Form Dialog */}
      <FinanceForm
        record={selectedRecord}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}