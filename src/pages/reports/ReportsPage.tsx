import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  Share,
  Printer,
} from 'lucide-react';
import { User } from '@/types/user';
import { DateRange } from 'react-day-picker';

interface ReportsPageProps {
  user: User;
}

// Mock data for demonstration
const projectOverview = {
  totalTasks: 156,
  completedTasks: 89,
  inProgressTasks: 45,
  overdueTasks: 22,
  totalBudget: 50000000,
  spentAmount: 15000000,
  remainingBudget: 35000000,
  projectProgress: 35,
};

const taskCompletionTrend = [
  { month: 'Jan', completed: 12, created: 15 },
  { month: 'Feb', completed: 18, created: 20 },
  { month: 'Mar', completed: 22, created: 25 },
  { month: 'Apr', completed: 28, created: 30 },
  { month: 'May', completed: 25, created: 28 },
  { month: 'Jun', completed: 30, created: 32 },
];

const budgetUtilization = [
  { category: 'Construction', budgeted: 30000000, spent: 8000000, percentage: 26.7 },
  { category: 'Equipment', budgeted: 10000000, spent: 3500000, percentage: 35.0 },
  { category: 'Permits', budgeted: 4000000, spent: 2000000, percentage: 50.0 },
  { category: 'Labor', budgeted: 3000000, spent: 1200000, percentage: 40.0 },
  { category: 'Materials', budgeted: 3000000, spent: 300000, percentage: 10.0 },
];

const milestoneProgress = [
  { name: 'Land Acquisition', progress: 100, status: 'completed' },
  { name: 'Permits & Approvals', progress: 75, status: 'in_progress' },
  { name: 'Site Preparation', progress: 60, status: 'in_progress' },
  { name: 'Foundation', progress: 25, status: 'planned' },
  { name: 'Construction', progress: 0, status: 'planned' },
];

const teamProductivity = [
  { member: 'John Doe', tasksCompleted: 28, efficiency: 92 },
  { member: 'Jane Smith', tasksCompleted: 25, efficiency: 88 },
  { member: 'Mike Johnson', tasksCompleted: 22, efficiency: 85 },
  { member: 'Sarah Wilson', tasksCompleted: 18, efficiency: 90 },
  { member: 'David Brown', tasksCompleted: 15, efficiency: 78 },
];

const riskAssessment = [
  { risk: 'Weather Delays', probability: 'High', impact: 'Medium', status: 'Active' },
  { risk: 'Permit Delays', probability: 'Medium', impact: 'High', status: 'Mitigated' },
  { risk: 'Budget Overrun', probability: 'Low', impact: 'High', status: 'Monitored' },
  { risk: 'Resource Shortage', probability: 'Medium', impact: 'Medium', status: 'Active' },
];

export default function ReportsPage({ user }: ReportsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-500';
      case 'active': return 'bg-red-500';
      case 'mitigated': return 'bg-green-500';
      case 'monitored': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const exportReport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting report in ${format} format`);
    // In a real application, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive project insights and performance analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="financial">Financial Report</SelectItem>
                <SelectItem value="progress">Progress Report</SelectItem>
                <SelectItem value="team">Team Performance</SelectItem>
                <SelectItem value="risk">Risk Assessment</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectOverview.projectProgress}%</div>
                <p className="text-xs text-muted-foreground">Overall completion</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((projectOverview.spentAmount / projectOverview.totalBudget) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(projectOverview.spentAmount)} spent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((projectOverview.completedTasks / projectOverview.totalTasks) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {projectOverview.completedTasks} of {projectOverview.totalTasks} tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{projectOverview.overdueTasks}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Task Completion Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
              <CardDescription>
                Monthly task creation vs completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={taskCompletionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="created" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Tasks Created"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Tasks Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Budget Utilization Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization by Category</CardTitle>
              <CardDescription>
                Spending analysis across different project categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={budgetUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                  <Bar dataKey="budgeted" fill="#e5e7eb" name="Budgeted" />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Budget Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetUtilization.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.category}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{item.percentage.toFixed(1)}%</div>
                      <Badge 
                        className={`${item.percentage > 50 ? 'bg-red-500' : item.percentage > 30 ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
                      >
                        {item.percentage > 50 ? 'High' : item.percentage > 30 ? 'Medium' : 'Low'} Usage
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Milestone Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Milestone Progress</CardTitle>
              <CardDescription>
                Current status of major project milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestoneProgress.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{milestone.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{milestone.progress}%</span>
                        <Badge className={`${getStatusColor(milestone.status)} text-white`}>
                          {milestone.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* Team Productivity */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>
                Individual team member productivity and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamProductivity.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{member.member}</h4>
                        <p className="text-sm text-gray-600">
                          {member.tasksCompleted} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{member.efficiency}%</div>
                      <Badge 
                        className={`${member.efficiency >= 90 ? 'bg-green-500' : member.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}
                      >
                        {member.efficiency >= 90 ? 'Excellent' : member.efficiency >= 80 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
              <CardDescription>
                Current project risks and their mitigation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessment.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{risk.risk}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Probability:</span>
                          <Badge className={`${getRiskColor(risk.probability)} text-white`}>
                            {risk.probability}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Impact:</span>
                          <Badge className={`${getRiskColor(risk.impact)} text-white`}>
                            {risk.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(risk.status)} text-white`}>
                      {risk.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}