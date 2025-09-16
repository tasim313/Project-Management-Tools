import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lead } from '@/types/lead';
import { X, Plus } from 'lucide-react';

interface LeadFormProps {
  lead?: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Omit<Lead, 'id'>) => void;
}

export function LeadForm({ lead, isOpen, onClose, onSubmit }: LeadFormProps) {
  const [formData, setFormData] = React.useState<Omit<Lead, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: 'website',
    status: 'new',
    priority: 'medium',
    expectedValue: 0,
    notes: '',
    tags: [],
    assignedTo: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastContactDate: undefined,
    nextFollowUpDate: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    socialMedia: {
      linkedin: '',
      facebook: '',
      twitter: ''
    }
  });

  const [newTag, setNewTag] = React.useState('');

  React.useEffect(() => {
    if (lead) {
      setFormData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        company: lead.company || '',
        position: lead.position || '',
        source: lead.source,
        status: lead.status,
        priority: lead.priority,
        expectedValue: lead.expectedValue || 0,
        notes: lead.notes || '',
        tags: lead.tags || [],
        assignedTo: lead.assignedTo || '',
        createdAt: lead.createdAt,
        updatedAt: new Date(),
        lastContactDate: lead.lastContactDate,
        nextFollowUpDate: lead.nextFollowUpDate,
        address: {
          street: lead.address?.street || '',
          city: lead.address?.city || '',
          state: lead.address?.state || '',
          zipCode: lead.address?.zipCode || '',
          country: lead.address?.country || ''
        },
        socialMedia: {
          linkedin: lead.socialMedia?.linkedin || '',
          facebook: lead.socialMedia?.facebook || '',
          twitter: lead.socialMedia?.twitter || ''
        }
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        source: 'website',
        status: 'new',
        priority: 'medium',
        expectedValue: 0,
        notes: '',
        tags: [],
        assignedTo: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastContactDate: undefined,
        nextFollowUpDate: undefined,
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        socialMedia: {
          linkedin: '',
          facebook: '',
          twitter: ''
        }
      });
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
          <DialogDescription>
            {lead ? 'Update lead information and track progress' : 'Add a new lead to your pipeline'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential lead details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Details</CardTitle>
                  <CardDescription>Source, status, and priority information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="social-media">Social Media</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="cold-call">Cold Call</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="advertisement">Advertisement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                          <SelectItem value="closed-won">Closed Won</SelectItem>
                          <SelectItem value="closed-lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedValue">Expected Value (৳)</Label>
                      <Input
                        id="expectedValue"
                        type="number"
                        value={formData.expectedValue}
                        onChange={(e) => handleInputChange('expectedValue', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={formData.assignedTo}
                        onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Address and social media details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.address?.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.address?.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.address?.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.address?.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.address?.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Social Media</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={formData.socialMedia?.linkedin}
                          onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.socialMedia?.facebook}
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={formData.socialMedia?.twitter}
                          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Follow-up Tracking</CardTitle>
                  <CardDescription>Track contact dates and schedule follow-ups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastContactDate">Last Contact Date</Label>
                      <Input
                        id="lastContactDate"
                        type="date"
                        value={formData.lastContactDate ? formData.lastContactDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('lastContactDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
                      <Input
                        id="nextFollowUpDate"
                        type="date"
                        value={formData.nextFollowUpDate ? formData.nextFollowUpDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('nextFollowUpDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {lead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}