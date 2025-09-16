
/
shadcn-ui
/
wiki.md
To make edits, upgrade to a paid plan
Bashurhat College Project Management System - Wiki
Table of Contents
Project Overview
Firebase Configuration
Database Rules
Data Providers
Authentication System
API Documentation
Security Implementation
Deployment Guide
Project Overview
This is a comprehensive project management system built for Bashurhat College with the following features:

Task Management
Lead Generation System
Team Meeting Scheduling
Budget & Finance Tracking
Document Management
Investor Portal
Reports & Analytics
Tech Stack:

Frontend: React + TypeScript + Vite
UI: Shadcn/UI + Tailwind CSS
Backend: Firebase (Firestore, Auth, Storage, Functions)
State Management: React Query
Routing: React Router
Firebase Configuration
Project Details
const firebaseConfig = {
  apiKey: "AIzaSyD4ULFHKUJT4WF0keT23zSM30LRO_E7OfE",
  authDomain: "bashurhat-college-project.firebaseapp.com",
  projectId: "bashurhat-college-project",
  storageBucket: "bashurhat-college-project.firebasestorage.app",
  messagingSenderId: "1029510088031",
  appId: "1:1029510088031:web:70345961719f724b46a2ea",
  measurementId: "G-Y04D6Y1R9L"
};
Services Enabled
Firestore Database: Document-based NoSQL database
Authentication: Email/Password + Google Sign-in
Cloud Storage: File uploads and document storage
Analytics: User behavior tracking
Cloud Functions: Server-side logic (future enhancement)
Database Rules
Firestore Security Rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions for authentication and authorization
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    function isAdminOrManager() {
      return hasRole('admin') || hasRole('project_manager');
    }
    
    function isTeamMember() {
      return hasRole('admin') || hasRole('project_manager') || hasRole('team_member');
    }
    
    function isAssignedTo(resource) {
      return isAuthenticated() && 
             (resource.data.assignedTo == request.auth.email || 
              resource.data.assigneeId == request.auth.uid);
    }

    // Users collection - users can read/write their own profile, admins can read all
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || hasRole('admin');
    }

    // Tasks collection - team members can read all, create/update assigned tasks
    match /tasks/{taskId} {
      allow read: if isTeamMember();
      allow create: if isTeamMember();
      allow update: if isAdminOrManager() || isAssignedTo(resource);
      allow delete: if isAdminOrManager();
    }

    // Leads collection - sales team and managers can manage leads
    match /leads/{leadId} {
      allow read: if isTeamMember();
      allow create: if isTeamMember();
      allow update: if isAdminOrManager() || isAssignedTo(resource);
      allow delete: if isAdminOrManager();
    }

    // Finance collection - admin and managers can manage, others can read
    match /finances/{financeId} {
      allow read: if isTeamMember();
      allow create, update, delete: if isAdminOrManager();
    }

    // Meetings collection - team members can read, managers can manage
    match /meetings/{meetingId} {
      allow read: if isTeamMember();
      allow create, update: if isTeamMember();
      allow delete: if isAdminOrManager();
    }

    // Documents collection - team members can read/create, managers can delete
    match /documents/{documentId} {
      allow read, create: if isTeamMember();
      allow update: if isTeamMember() && 
                       (resource.data.uploadedBy == request.auth.uid || isAdminOrManager());
      allow delete: if isAdminOrManager() || resource.data.uploadedBy == request.auth.uid;
    }

    // Default deny rule for any other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
Storage Security Rules
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.role == 'admin';
    }
    
    function isManager() {
      return isAuthenticated() && 
             (request.auth.token.role == 'manager' || isAdmin());
    }
    
    function isValidSize() {
      return request.resource.size <= 10 * 1024 * 1024; // 10MB limit
    }
    
    function isValidImageType() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidDocumentType() {
      return request.resource.contentType in [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/csv'
      ];
    }

    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      isValidImageType() &&
                      isValidSize();
    }

    // Project documents
    match /documents/{projectId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                      (isValidDocumentType() || isValidImageType()) &&
                      isValidSize();
      allow delete: if isManager();
    }

    // Default deny rule
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
Data Providers
Database Collections Structure
Users Collection
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'project_manager' | 'team_member' | 'investor';
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
}
Tasks Collection
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  assigneeId: string;
  dueDate: Date;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
Leads Collection
interface Lead {
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
Finance Collection
interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  receiptUrl?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
Meetings Collection
interface Meeting {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  location: string;
  attendees: string[]; // email addresses
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agenda?: string;
  meetingUrl?: string; // for virtual meetings
  recordingUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
Documents Collection
interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
Data Service Classes
Generic DataService
export class DataService {
  static async create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T>
  static async readAll<T>(collectionName: string): Promise<T[]>
  static async readOne<T>(collectionName: string, id: string): Promise<T | null>
  static async update<T>(collectionName: string, id: string, updates: Partial<T>): Promise<T>
  static async delete(collectionName: string, id: string): Promise<void>
  static async query<T>(collectionName: string, conditions: QueryCondition[]): Promise<T[]>
}
Specific Service Classes
TaskService - Task management operations
LeadService - Lead generation and tracking
FinanceService - Financial record management
MeetingService - Meeting scheduling and management
DocumentService - Document upload and management
UserService - User profile management
Authentication System
User Roles and Permissions
Admin
Full access to all features
User management
System settings
Financial record management
Delete any resource
Project Manager
Task assignment and management
Lead assignment and tracking
Meeting scheduling
Budget oversight (read/write)
Team member management
Team Member
View all tasks and leads
Update assigned tasks
Create leads and meetings
Upload documents
View financial reports (read-only)
Investor
View project progress
Access financial reports
View meeting summaries
Limited document access
Authentication Flow
Login Process:

// Email/Password Login
const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Get user role from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.data();
  
  return { user, role: userData?.role };
};
Registration Process:

const registerUser = async (email: string, password: string, role: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: role,
    createdAt: serverTimestamp(),
    isActive: true
  });
};
Role-based Route Protection:

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = useAuth();
  
  if (!user) return <LoginPage />;
  if (requiredRole && role !== requiredRole) return <UnauthorizedPage />;
  
  return children;
};
Demo Accounts
For testing purposes, the following demo accounts are available:

const demoAccounts = [
  {
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    displayName: 'System Administrator'
  },
  {
    email: 'manager@college.edu',
    password: 'manager123',
    role: 'project_manager',
    displayName: 'Project Manager'
  },
  {
    email: 'team@college.edu',
    password: 'team123',
    role: 'team_member',
    displayName: 'Team Member'
  },
  {
    email: 'investor@college.edu',
    password: 'investor123',
    role: 'investor',
    displayName: 'Investor'
  }
];
API Documentation
Task Management API
// Create Task
POST /tasks
Body: {
  title: string,
  description: string,
  assignee: string,
  dueDate: Date,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  category: string,
  tags: string[]
}

// Get All Tasks
GET /tasks
Query: ?status=pending&assignee=user@example.com

// Update Task
PUT /tasks/:id
Body: Partial<Task>

// Delete Task
DELETE /tasks/:id
Lead Management API
// Create Lead
POST /leads
Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  company?: string,
  source: string,
  status: string,
  expectedValue?: number
}

// Get All Leads
GET /leads
Query: ?status=qualified&assignedTo=user@example.com

// Update Lead
PUT /leads/:id
Body: Partial<Lead>

// Delete Lead
DELETE /leads/:id
Finance Management API
// Create Finance Record
POST /finances
Body: {
  type: 'income' | 'expense',
  category: string,
  amount: number,
  description: string,
  date: Date
}

// Get Finance Records
GET /finances
Query: ?type=expense&category=construction&startDate=2024-01-01&endDate=2024-12-31

// Update Finance Record
PUT /finances/:id
Body: Partial<FinanceRecord>

// Delete Finance Record
DELETE /finances/:id
Security Implementation
Data Validation
Client-side Validation:

Form validation using React Hook Form + Zod
Input sanitization
File type and size validation
Server-side Validation:

Firestore security rules
Cloud Functions validation (future)
Authentication token verification
Security Best Practices
Authentication Security:

Strong password requirements
Email verification
Session management
Role-based access control
Data Security:

Encryption at rest (Firebase default)
HTTPS enforcement
Input sanitization
SQL injection prevention (NoSQL)
File Upload Security:

File type validation
Size limitations (10MB max)
Virus scanning (future enhancement)
Access control
Deployment Guide
Prerequisites
Firebase CLI Installation:

npm install -g firebase-tools
Login to Firebase:

firebase login
Deployment Steps
Initialize Firebase Project:

firebase init
# Select: Firestore, Hosting, Storage
Deploy Security Rules:

firebase deploy --only firestore:rules
firebase deploy --only storage
Build and Deploy Application:

npm run build
firebase deploy --only hosting
Enable Authentication:

Go to Firebase Console
Enable Email/Password authentication
Configure authorized domains
Environment Variables
Create .env file:

VITE_FIREBASE_API_KEY=AIzaSyD4ULFHKUJT4WF0keT23zSM30LRO_E7OfE
VITE_FIREBASE_AUTH_DOMAIN=bashurhat-college-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bashurhat-college-project
VITE_FIREBASE_STORAGE_BUCKET=bashurhat-college-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1029510088031
VITE_FIREBASE_APP_ID=1:1029510088031:web:70345961719f724b46a2ea
VITE_FIREBASE_MEASUREMENT_ID=G-Y04D6Y1R9L
Production Checklist
[ ] Security rules deployed
[ ] Authentication enabled
[ ] Storage rules configured
[ ] Analytics enabled
[ ] Performance monitoring setup
[ ] Backup strategy implemented
[ ] Error monitoring configured
[ ] SSL certificate verified
[ ] Domain configuration complete
[ ] User roles and permissions tested
Monitoring and Maintenance
Performance Monitoring
Firebase Performance:

Page load times
Network request monitoring
Custom performance traces
Analytics:

User engagement metrics
Feature usage tracking
Conversion funnel analysis
Error Monitoring
Crashlytics:

Real-time crash reporting
Error aggregation
User impact analysis
Custom Error Logging:

API error tracking
User action logging
Performance bottleneck identification
Backup and Recovery
Automated Backups:

Daily Firestore exports
Storage file backups
Configuration backups
Recovery Procedures:

Data restoration process
Rollback procedures
Disaster recovery plan
Support and Contact
For technical support or questions about this system:

Developer: Alex (Engineer)
Project: Bashurhat College Project Management
Documentation: This wiki.md file
Last Updated: 2024-11-24
This documentation is maintained and updated regularly. Please refer to the latest version for accurate information.