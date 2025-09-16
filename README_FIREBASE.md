Firebase Integration Setup Guide
This document explains how to set up Firebase for the Bashurhat College Project Management System.

Firebase Configuration
1. Create Firebase Project
Go to Firebase Console
Click “Create a project”
Enter project name: bashurhat-college-project
Enable Google Analytics (optional)
2. Enable Firebase Services
Firestore Database
Go to Firestore Database in Firebase Console
Click “Create database”
Choose “Start in test mode” initially
Select a location (asia-south1 for Bangladesh)
Authentication
Go to Authentication in Firebase Console
Click “Get started”
Enable Email/Password authentication
Enable Google authentication (optional)
Storage
Go to Storage in Firebase Console
Click “Get started”
Choose “Start in test mode”
Select same location as Firestore
3. Get Firebase Configuration
Go to Project Settings (gear icon)
Scroll down to “Your apps”
Click “Add app” and select Web
Register your app with name: bashurhat-college-web
Copy the configuration object
4. Update Firebase Config
Replace the configuration in src/lib/firebase.ts:

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
Database Structure
Collections
users
{
  id: string,
  email: string,
  displayName: string,
  role: 'admin' | 'manager' | 'team_member' | 'investor',
  createdAt: timestamp,
  updatedAt: timestamp
}
tasks
{
  id: string,
  title: string,
  description: string,
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  assignee: string,
  dueDate: timestamp,
  tags: string[],
  category: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
leads
{
  id: string,
  name: string,
  email: string,
  phone: string,
  company: string,
  position: string,
  source: string,
  status: string,
  priority: string,
  estimatedValue: number,
  notes: string,
  tags: string[],
  assignedTo: string,
  nextFollowUpDate: timestamp,
  conversionProbability: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
finances
{
  id: string,
  type: 'income' | 'expense',
  category: string,
  amount: number,
  description: string,
  date: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
meetings
{
  id: string,
  title: string,
  description: string,
  date: timestamp,
  time: string,
  duration: number,
  location: string,
  attendees: string[],
  status: string,
  priority: string,
  agenda: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
documents
{
  id: string,
  name: string,
  type: string,
  size: number,
  url: string,
  uploadedBy: string,
  category: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
Security Rules
The Firebase security rules are configured to:

Authentication Required: All operations require user authentication
Role-Based Access: Different permissions for admin, manager, team member, and investor roles
Data Ownership: Users can only modify their own data unless they have elevated permissions
Resource Assignment: Users can modify resources assigned to them
User Roles and Permissions
Admin
Full read/write access to all collections
Can manage users and system settings
Can delete any resource
Manager
Read/write access to tasks, leads, meetings, finances
Can assign tasks and leads to team members
Cannot delete finance records (admin only)
Team Member
Read access to all collections
Can create and update assigned tasks
Can create leads and meetings
Can upload documents
Investor
Read-only access to most collections
Can view financial reports and project progress
Can create leads for potential partnerships
Storage Rules
File upload permissions:

Profile Images: Users can upload their own profile pictures (max 10MB)
Documents: Authenticated users can upload project documents
Attachments: Task and lead attachments allowed for authenticated users
Finance Receipts: Only managers can upload finance-related documents
Deployment Commands
Install Firebase CLI
npm install -g firebase-tools
Login to Firebase
firebase login
Initialize Firebase in Project
firebase init
Select:

Firestore
Hosting
Storage
Deploy Security Rules
firebase deploy --only firestore:rules
firebase deploy --only storage
Deploy Application
npm run build
firebase deploy --only hosting
Environment Variables
Create .env file with:

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
Testing
Local Development with Emulators
firebase emulators:start
This starts local emulators for:

Firestore (port 8080)
Authentication (port 9099)
Storage (port 9199)
Hosting (port 5000)
Production Testing
Deploy rules: firebase deploy --only firestore:rules
Test with different user roles
Verify data access permissions
Test file upload functionality
Monitoring and Analytics
Firestore Usage: Monitor read/write operations in Firebase Console
Authentication: Track user sign-ups and logins
Storage: Monitor file uploads and storage usage
Performance: Use Firebase Performance Monitoring
Crashlytics: Set up crash reporting for production
Backup Strategy
Automated Backups: Set up scheduled Firestore exports
Storage Backups: Regular backup of uploaded files
Configuration Backup: Keep Firebase configuration in version control
Recovery Testing: Regularly test backup restoration procedures
Cost Optimization
Firestore: Optimize queries to reduce read operations
Storage: Implement file compression and cleanup policies
Authentication: Monitor active users
Hosting: Use CDN for static assets
Functions: Optimize cloud function execution time
Security Best Practices
Regular Rule Updates: Review and update security rules monthly
User Management: Regular audit of user roles and permissions
API Key Security: Restrict API keys to specific domains
Data Validation: Implement client and server-side validation
Audit Logs: Monitor database access patterns