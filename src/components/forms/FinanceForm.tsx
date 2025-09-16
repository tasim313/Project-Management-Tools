import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FinanceRecord } from '@/types/finance';

interface FinanceFormProps {
  record?: FinanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recordData: Omit<FinanceRecord, 'id'>) => void;
}

export function FinanceForm({ record, isOpen, onClose, onSubmit }: FinanceFormProps) {
  const [formData, setFormData] = React.useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: ''
  });

  React.useEffect(() => {
    if (record) {
      setFormData({
        type: record.type || 'expense',
        category: record.category || '',
        amount: record.amount?.toString() || '',
        description: record.description || '',
        date: record.date ? new Date(record.date).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [record, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      type: formData.type as 'income' | 'expense',
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description,
      date: formData.date ? new Date(formData.date) : new Date()
    };

    onSubmit(recordData);
    onClose();
  };

  const categories = {
    income: ['Investment', 'Grant', 'Donation', 'Revenue', 'Other Income'],
    expense: ['Land', 'Construction', 'Equipment', 'Salaries', 'Marketing', 'Legal', 'Other Expense']
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{record ? 'Edit Finance Record' : 'Add New Finance Record'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, category: '' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type as keyof typeof categories].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (BDT)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {record ? 'Update Record' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}