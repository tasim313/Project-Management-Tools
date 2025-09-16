import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agenda: string;
}

interface MeetingFormProps {
  meeting?: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meetingData: Omit<Meeting, 'id'>) => void;
}

export function MeetingForm({ meeting, isOpen, onClose, onSubmit }: MeetingFormProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    attendees: '',
    status: 'scheduled',
    priority: 'medium',
    agenda: ''
  });

  React.useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        description: meeting.description || '',
        date: meeting.date ? new Date(meeting.date).toISOString().split('T')[0] : '',
        time: meeting.time || '',
        duration: meeting.duration?.toString() || '60',
        location: meeting.location || '',
        attendees: meeting.attendees?.join(', ') || '',
        status: meeting.status || 'scheduled',
        priority: meeting.priority || 'medium',
        agenda: meeting.agenda || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: '60',
        location: '',
        attendees: '',
        status: 'scheduled',
        priority: 'medium',
        agenda: ''
      });
    }
  }, [meeting, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meetingData = {
      title: formData.title,
      description: formData.description,
      date: formData.date ? new Date(formData.date) : new Date(),
      time: formData.time,
      duration: parseInt(formData.duration) || 60,
      location: formData.location,
      attendees: formData.attendees.split(',').map(a => a.trim()).filter(Boolean),
      status: formData.status as Meeting['status'],
      priority: formData.priority as Meeting['priority'],
      agenda: formData.agenda
    };

    onSubmit(meetingData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meeting ? 'Edit Meeting' : 'Schedule New Meeting'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="480"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Conference Room A"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="attendees">Attendees (comma separated)</Label>
            <Input
              id="attendees"
              value={formData.attendees}
              onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
              placeholder="john@example.com, jane@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="agenda">Meeting Agenda</Label>
            <Textarea
              id="agenda"
              value={formData.agenda}
              onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
              rows={4}
              placeholder="1. Review project progress&#10;2. Discuss budget allocation&#10;3. Next steps"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {meeting ? 'Update Meeting' : 'Schedule Meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}