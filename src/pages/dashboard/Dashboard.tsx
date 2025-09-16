import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckSquare, 
  Calendar,
  FileText,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  // Mock data for dashboard - in a real app, this would come from props or API
  const projectStats = {
    totalBudget: 50000000, // 5 Crore BDT
    spentBudget: 15000000, // 1.5 Crore BDT
    totalTasks: 45,
    completedTasks: 18,
    totalTeamMembers: 12,
    activeMembers: 8,
    upcomingMeetings: 3,
    pendingDocuments: 7
  };

  const budgetProgress = (projectStats.spentBudget / projectStats.totalBudget) * 100;
  const taskProgress = (projectStats.completedTasks / projectStats.totalTasks) * 100;

  const recentActivities = [
    {
      id: 1,
      type: 'task',
      title: 'Land acquisition documentation completed',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Budget review meeting scheduled',
      time: '4 hours ago',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'finance',
      title: 'Construction material cost updated',
      time: '1 day ago',
      status: 'updated'
    },
    {
      id: 4,
      type: 'document',
      title: 'Building permit application submitted',
      time: '2 days ago',
      status: 'pending'
    }
  ];

  const upcomingMilestones = [
    {
      id: 1,
      title: 'Foundation Construction Start',
      date: '2024-11-15',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Infrastructure Planning Complete',
      date: '2024-12-01',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Faculty Recruitment Phase 1',
      date: '2024-12-20',
      status: 'planned'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'updated': return 'outline';
      case 'pending': return 'destructive';
      case 'in-progress': return 'default';
      case 'planned': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Bashurhat College Project Management System
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{(projectStats.totalBudget / 10000000).toFixed(1)}Cr</div>
            <p className="text-xs text-muted-foreground">
              Allocated for college establishment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{(projectStats.spentBudget / 10000000).toFixed(1)}Cr</div>
            <p className="text-xs text-muted-foreground">
              {budgetProgress.toFixed(1)}% of total budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.completedTasks}/{projectStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {taskProgress.toFixed(1)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.activeMembers}/{projectStats.totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
            <CardDescription>
              Current spending vs allocated budget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={budgetProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Spent: ৳{(projectStats.spentBudget / 10000000).toFixed(1)}Cr</span>
              <span>Total: ৳{(projectStats.totalBudget / 10000000).toFixed(1)}Cr</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>
              Overall project progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={taskProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Completed: {projectStats.completedTasks}</span>
              <span>Total: {projectStats.totalTasks}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Milestones */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest project updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                      <Badge variant={getStatusColor(activity.status)} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>
              Key project deadlines and targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {milestone.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            <div className="flex items-center space-x-2 p-2 rounded-lg border bg-card hover:bg-accent cursor-pointer">
              <CheckSquare className="h-4 w-4" />
              <span className="text-sm">Create Task</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border bg-card hover:bg-accent cursor-pointer">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Schedule Meeting</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border bg-card hover:bg-accent cursor-pointer">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Add Expense</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border bg-card hover:bg-accent cursor-pointer">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Upload Document</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}