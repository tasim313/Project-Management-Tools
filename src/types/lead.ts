export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    position?: string;
    source: 'website' | 'social-media' | 'referral' | 'cold-call' | 'event' | 'advertisement' | 'other';
    status: 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'negotiation' | 'closed-won' | 'closed-lost';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    expectedValue?: number;
    notes?: string;
    tags?: string[];
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
    lastContactDate?: Date;
    nextFollowUpDate?: Date;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    socialMedia?: {
      linkedin?: string;
      facebook?: string;
      twitter?: string;
    };
  }