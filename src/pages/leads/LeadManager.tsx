import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { LeadForm } from '@/components/forms/LeadForm';
import { DataService } from '@/lib/data-service';
import { Lead } from '@/types/lead';
import { Plus, Users, TrendingUp, Clock, Target, Mail, Phone, Building, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function LeadManager() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadLeads = async () => {
    try {
      setLoading(true);
      let allLeads = await DataService.readAll<Lead>('leads');
      
      // Initialize with sample data if empty
      if (allLeads.length === 0) {
        const sampleLeads: Omit<Lead, 'id'>[] = [
          {
            firstName: 'Ahmed',
            lastName: 'Rahman',
            email: 'ahmed.rahman@example.com',
            phone: '+880-1711-123456',
            company: 'Rahman Industries',
            position: 'CEO',
            source: 'website',
            status: 'qualified',
            priority: 'high',
            expectedValue: 5000000,
            notes: 'Interested in college partnership for employee training programs',
            tags: ['partnership', 'training', 'corporate'],
            assignedTo: 'Project Manager',
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-15'),
            lastContactDate: new Date('2024-10-10'),
            nextFollowUpDate: new Date('2024-11-01'),
            address: {
              street: '123 Business District',
              city: 'Dhaka',
              state: 'Dhaka Division',
              zipCode: '1000',
              country: 'Bangladesh'
            },
            socialMedia: {
              linkedin: 'https://linkedin.com/in/ahmedrahman',
              facebook: '',
              twitter: ''
            }
          },
          {
            firstName: 'Fatima',
            lastName: 'Khan',
            email: 'fatima.khan@techcorp.bd',
            phone: '+880-1712-234567',
            company: 'TechCorp Bangladesh',
            position: 'HR Director',
            source: 'referral',
            status: 'proposal-sent',
            priority: 'medium',
            expectedValue: 3000000,
            notes: 'Looking for skilled graduates for software development positions',
            tags: ['recruitment', 'graduates', 'software'],
            assignedTo: 'Team Member',
            createdAt: new Date('2024-09-15'),
            updatedAt: new Date('2024-10-20'),
            lastContactDate: new Date('2024-10-18'),
            nextFollowUpDate: new Date('2024-10-25'),
            address: {
              street: '456 Tech Park',
              city: 'Chittagong',
              state: 'Chittagong Division',
              zipCode: '4000',
              country: 'Bangladesh'
            },
            socialMedia: {
              linkedin: 'https://linkedin.com/in/fatimakhan',
              facebook: '',
              twitter: ''
            }
          },
          {
            firstName: 'Mohammad',
            lastName: 'Ali',
            email: 'mohammad.ali@gmail.com',
            phone: '+880-1713-345678',
            company: 'Local Business Association',
            position: 'President',
            source: 'event',
            status: 'new',
            priority: 'medium',
            expectedValue: 2000000,
            notes: 'Met at local business networking event. Interested in supporting education initiatives',
            tags: ['networking', 'community', 'support'],
            assignedTo: 'Administrator',
            createdAt: new Date('2024-10-20'),
            updatedAt: new Date('2024-10-20'),
            lastContactDate: undefined,
            nextFollowUpDate: new Date('2024-10-30'),
            address: {
              street: '789 Main Street',
              city: 'Noakhali',
              state: 'Chittagong Division',
              zipCode: '3800',
              country: 'Bangladesh'
            },
            socialMedia: {
              linkedin: '',
              facebook: 'https://facebook.com/mohammadali',
              twitter: ''
            }
          },
          {
            firstName: 'Sarah',
            lastName: 'Ahmed',
            email: 'sarah.ahmed@education.gov.bd',
            phone: '+880-1714-456789',
            company: 'Ministry of Education',
            position: 'Education Officer',
            source: 'cold-call',
            status: 'contacted',
            priority: 'high',
            expectedValue: 10000000,
            notes: 'Government contact for potential funding and accreditation support',
            tags: ['government', 'funding', 'accreditation'],
            assignedTo: 'Administrator',
            createdAt: new Date('2024-09-01'),
            updatedAt: new Date('2024-10-05'),
            lastContactDate: new Date('2024-10-03'),
            nextFollowUpDate: new Date('2024-11-15'),
            address: {
              street: 'Bangladesh Secretariat',
              city: 'Dhaka',
              state: 'Dhaka Division',
              zipCode: '1000',
              country: 'Bangladesh'
            },
            socialMedia: {
              linkedin: 'https://linkedin.com/in/sarahahmed',
              facebook: '',
              twitter: ''
            }
          },
          {
            firstName: 'Karim',
            lastName: 'Hassan',
            email: 'karim@constructionltd.bd',
            phone: '+880-1715-567890',
            company: 'Hassan Construction Ltd',
            position: 'Managing Director',
            source: 'advertisement',
            status: 'negotiation',
            priority: 'urgent',
            expectedValue: 15000000,
            notes: 'Potential construction partner for college building project',
            tags: ['construction', 'partnership', 'building'],
            assignedTo: 'Project Manager',
            createdAt: new Date('2024-08-15'),
            updatedAt: new Date('2024-10-22'),
            lastContactDate: new Date('2024-10-20'),
            nextFollowUpDate: new Date('2024-10-28'),
            address: {
              street: '321 Industrial Area',
              city: 'Sylhet',
              state: 'Sylhet Division',
              zipCode: '3100',
              country: 'Bangladesh'
            },
            socialMedia: {
              linkedin: 'https://linkedin.com/in/karimhassan',
              facebook: '',
              twitter: ''
            }
          }
        ];

        for (const lead of sampleLeads) {
          await DataService.create<Lead>('leads', lead);
        }
        
        allLeads = await DataService.readAll<Lead>('leads');
      }
      
      setLeads(allLeads);
    } catch (error) {
      console.error('Failed to load leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLeads();
  }, []);

  const handleCreateLead = async (leadData: Omit<Lead, 'id'>) => {
    try {
      await DataService.create<Lead>('leads', leadData);
      await loadLeads();
      toast.success('Lead created successfully');
    } catch (error) {
      console.error('Failed to create lead:', error);
      toast.error('Failed to create lead');
    }
  };

  const handleUpdateLead = async (leadData: Omit<Lead, 'id'>) => {
    if (!selectedLead) return;
    
    try {
      await DataService.update<Lead>('leads', selectedLead.id, leadData);
      await loadLeads();
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Failed to update lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await DataService.delete('leads', lead.id);
      await loadLeads();
      toast.success('Lead deleted successfully');
    } catch (error) {
      console.error('Failed to delete lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
  };

  const handleFormSubmit = (leadData: Omit<Lead, 'id'>) => {
    if (selectedLead) {
      handleUpdateLead(leadData);
    } else {
      handleCreateLead(leadData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'contacted': return 'default';
      case 'qualified': return 'default';
      case 'proposal-sent': return 'default';
      case 'negotiation': return 'default';
      case 'closed-won': return 'default';
      case 'closed-lost': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'default';
      case 'social-media': return 'secondary';
      case 'referral': return 'default';
      case 'cold-call': return 'outline';
      case 'event': return 'secondary';
      case 'advertisement': return 'outline';
      default: return 'outline';
    }
  };

  const columns = [
    {
      key: 'firstName' as keyof Lead,
      label: 'Lead',
      render: (value: string, lead: Lead) => (
        <div>
          <div className="font-medium">{`${lead.firstName} ${lead.lastName}`}</div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Mail className="h-3 w-3 mr-1" />
            {lead.email}
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {lead.phone}
          </div>
        </div>
      )
    },
    {
      key: 'company' as keyof Lead,
      label: 'Company',
      render: (value: string, lead: Lead) => (
        <div>
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            <div>
              <div className="font-medium">{value || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">{lead.position || 'No position'}</div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'source' as keyof Lead,
      label: 'Source',
      render: (value: string) => (
        <Badge variant={getSourceColor(value)}>
          {value.replace('-', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'status' as keyof Lead,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusColor(value)}>
          {value.replace('-', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'priority' as keyof Lead,
      label: 'Priority',
      render: (value: string) => (
        <Badge variant={getPriorityColor(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'expectedValue' as keyof Lead,
      label: 'Expected Value',
      render: (value: number) => (
        <div className="font-medium">
          {value ? `৳${value.toLocaleString()}` : 'N/A'}
        </div>
      )
    },
    {
      key: 'assignedTo' as keyof Lead,
      label: 'Assigned To',
      render: (value: string) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          {value || 'Unassigned'}
        </div>
      )
    },
    {
      key: 'nextFollowUpDate' as keyof Lead,
      label: 'Next Follow-up',
      render: (value: Date) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {value ? new Date(value).toLocaleDateString() : 'Not scheduled'}
        </div>
      )
    }
  ];

  const leadStats = React.useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const qualified = leads.filter(l => l.status === 'qualified').length;
    const closedWon = leads.filter(l => l.status === 'closed-won').length;
    const totalValue = leads.reduce((sum, lead) => sum + (lead.expectedValue || 0), 0);
    
    return { total, newLeads, qualified, closedWon, totalValue };
  }, [leads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage potential leads for the college project</p>
        </div>
        <Button onClick={handleAddLead}>
          <Plus className="h-4 w-4 mr-2" />
          Create Lead
        </Button>
      </div>

      {/* Lead Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{leadStats.newLeads}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{leadStats.qualified}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{leadStats.closedWon}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{leadStats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>
            Create, edit, and manage leads for the college project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={leads}
            columns={columns}
            onAdd={handleAddLead}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            addLabel="Create Lead"
            searchable={true}
          />
        </CardContent>
      </Card>

      {/* Lead Form Dialog */}
      <LeadForm
        lead={selectedLead}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}