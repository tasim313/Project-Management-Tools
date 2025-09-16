import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { MeetingForm, Meeting } from '@/components/forms/MeetingForm';
import { DataService } from '@/lib/data-service';
import { Plus, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function MeetingManager() {
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = React.useState<Meeting | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const allMeetings = await DataService.readAll<Meeting>('meetings');
      setMeetings(allMeetings);
      
      // Initialize with sample data if empty
      if (allMeetings.length === 0) {
        const sampleMeetings = [
          {
            title: 'Project Kickoff Meeting',
            description: 'Initial project planning and team introduction',
            date: new Date('2024-10-20'),
            time: '10:00',
            duration: 90,
            location: 'Conference Room A',
            attendees: ['admin@college.edu', 'manager@college.edu', 'team@college.edu'],
            status: 'scheduled' as const,
            priority: 'high' as const,
            agenda: '1. Project overview\n2. Team roles and responsibilities\n3. Timeline discussion\n4. Resource allocation'
          },
          {
            title: 'Budget Review Meeting',
            description: 'Monthly budget review and expense analysis',
            date: new Date('2024-10-25'),
            time: '14:00',
            duration: 60,
            location: 'Finance Office',
            attendees: ['admin@college.edu', 'investor@college.edu'],
            status: 'completed' as const,
            priority: 'medium' as const,
            agenda: '1. Review monthly expenses\n2. Budget variance analysis\n3. Forecast adjustments'
          }
        ];

        for (const meeting of sampleMeetings) {
          await DataService.create<Meeting>('meetings', meeting);
        }
        
        const updatedMeetings = await DataService.readAll<Meeting>('meetings');
        setMeetings(updatedMeetings);
      }
    } catch (error) {
      console.error('Failed to load meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMeetings();
  }, []);

  const handleCreateMeeting = async (meetingData: Omit<Meeting, 'id'>) => {
    try {
      await DataService.create<Meeting>('meetings', meetingData);
      await loadMeetings();
      toast.success('Meeting scheduled successfully');
    } catch (error) {
      console.error('Failed to create meeting:', error);
      toast.error('Failed to schedule meeting');
    }
  };

  const handleUpdateMeeting = async (meetingData: Omit<Meeting, 'id'>) => {
    if (!selectedMeeting) return;
    
    try {
      await DataService.update<Meeting>('meetings', selectedMeeting.id, meetingData);
      await loadMeetings();
      toast.success('Meeting updated successfully');
    } catch (error) {
      console.error('Failed to update meeting:', error);
      toast.error('Failed to update meeting');
    }
  };

  const handleDeleteMeeting = async (meeting: Meeting) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    
    try {
      await DataService.delete('meetings', meeting.id);
      await loadMeetings();
      toast.success('Meeting deleted successfully');
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      toast.error('Failed to delete meeting');
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleAddMeeting = () => {
    setSelectedMeeting(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMeeting(null);
  };

  const handleFormSubmit = (meetingData: Omit<Meeting, 'id'>) => {
    if (selectedMeeting) {
      handleUpdateMeeting(meetingData);
    } else {
      handleCreateMeeting(meetingData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
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

  const columns = [
    {
      key: 'title' as keyof Meeting,
      label: 'Meeting',
      render: (value: string, meeting: Meeting) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{meeting.description}</div>
        </div>
      )
    },
    {
      key: 'date' as keyof Meeting,
      label: 'Date & Time',
      render: (value: Date, meeting: Meeting) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <div>
            <div>{value ? new Date(value).toLocaleDateString() : 'No date'}</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {meeting.time} ({meeting.duration}min)
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'location' as keyof Meeting,
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {value || 'Not specified'}
        </div>
      )
    },
    {
      key: 'attendees' as keyof Meeting,
      label: 'Attendees',
      render: (value: string[]) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          {value?.length || 0} attendees
        </div>
      )
    },
    {
      key: 'status' as keyof Meeting,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusColor(value)}>
          {value.replace('-', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'priority' as keyof Meeting,
      label: 'Priority',
      render: (value: string) => (
        <Badge variant={getPriorityColor(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    }
  ];

  const meetingStats = React.useMemo(() => {
    const total = meetings.length;
    const scheduled = meetings.filter(m => m.status === 'scheduled').length;
    const completed = meetings.filter(m => m.status === 'completed').length;
    const inProgress = meetings.filter(m => m.status === 'in-progress').length;
    
    return { total, scheduled, completed, inProgress };
  }, [meetings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading meetings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Meetings</h1>
          <p className="text-muted-foreground">Schedule and manage team meetings</p>
        </div>
        <Button onClick={handleAddMeeting}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Meeting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{meetingStats.scheduled}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{meetingStats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{meetingStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Meetings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>
            Create, edit, and manage team meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={meetings}
            columns={columns}
            onAdd={handleAddMeeting}
            onEdit={handleEditMeeting}
            onDelete={handleDeleteMeeting}
            addLabel="Schedule Meeting"
          />
        </CardContent>
      </Card>

      {/* Meeting Form Dialog */}
      <MeetingForm
        meeting={selectedMeeting}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}