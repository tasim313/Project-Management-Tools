Firebase Security Rules Documentation
Overview
This document explains the Firebase Firestore security rules for the Bashurhat College Project Management System.

User Roles
The system supports four user roles with different permission levels:

Admin - Full access to all data and system management
Manager - Can manage projects, approve finances, and oversee operations
Team Member - Can create and update assigned tasks, leads, and basic operations
Investor - Limited read access to approved financial data and public documents
Collection Rules
1. Finance Collection (/finances/{financeId})
Read Permissions:

Team members and above: Full access
Investors: Can only read approved income records
Create Permissions:

Team members and above can create finance records
Required fields: type, category, amount, description, date
Amount must be positive number
Type must be ‘income’ or ‘expense’
Status (if provided) must be ‘pending’, ‘approved’, or ‘rejected’
Update Permissions:

Managers: Can update any field including status (approve/reject)
Team members: Can only edit their own pending records
Delete Permissions:

Managers and above only
Validation Rules:

// Required fields
['type', 'category', 'amount', 'description', 'date']

// Type validation
type in ['income', 'expense']

// Amount validation
amount > 0 && amount is number

// Status validation (optional)
status in ['pending', 'approved', 'rejected']
2. Leads Collection (/leads/{leadId})
Read Permissions:

All team members and above
Create Permissions:

Team members and above
Required fields: firstName, lastName, email, phone
Email must match regex pattern: .*@.*\..*
Update Permissions:

Assigned users or managers
Must maintain valid email format
Delete Permissions:

Managers and above only
Validation Rules:

// Required fields
['firstName', 'lastName', 'email', 'phone']

// Email validation
email.matches('.*@.*\\..*')

// Status validation (optional)
status in ['new', 'contacted', 'qualified', 'proposal-sent', 'negotiation', 'closed-won', 'closed-lost']

// Priority validation (optional)
priority in ['low', 'medium', 'high', 'urgent']

// Source validation (optional)
source in ['website', 'social-media', 'referral', 'cold-call', 'event', 'advertisement', 'other']
3. Investors Collection (/investors/{investorId})
Read Permissions:

Team members and above: Full access
Investors: Can read their own record only (matched by email)
Create Permissions:

Managers and above only (sensitive financial data)
Required fields: firstName, lastName, email, phone, investmentAmount, investmentType, riskLevel
Investment amount must be positive
Email must be valid format
Update Permissions:

Managers: Can update any field
Team members: Can only update non-financial fields (notes, tags, follow-up dates)
Delete Permissions:

Admins only (financial records are highly sensitive)
Validation Rules:

// Required fields
['firstName', 'lastName', 'email', 'phone', 'investmentAmount', 'investmentType', 'riskLevel']

// Investment amount validation
investmentAmount > 0 && investmentAmount is number

// Investment type validation
investmentType in ['equity', 'debt', 'grant', 'donation']

// Status validation (optional)
status in ['prospect', 'committed', 'invested', 'declined']

// Risk level validation
riskLevel in ['low', 'medium', 'high']

// Expected ROI validation (optional)
expectedROI >= 0 && expectedROI is number
4. Tasks Collection (/tasks/{taskId})
Read Permissions:

All team members and above
Create Permissions:

Team members and above
Required fields: title, description, status, priority
Update Permissions:

Assigned users or managers
Delete Permissions:

Managers and above
5. Additional Collections
Meetings (/meetings/{meetingId}):

Team members can read/create
Creator or managers can update
Managers can delete
Documents (/documents/{documentId}):

Team members have full access
Investors can read public documents only
Visibility levels: ‘private’, ‘team’, ‘public’
Users (/users/{userId}):

Users can read/update their own profile
Managers can read all profiles
Admins can delete users
Security Features
1. Authentication Requirements
All operations require valid authentication (request.auth != null)

2. Role-Based Access Control
function isAdmin() {
  return isAuthenticated() && getUserRole() == 'admin';
}

function isManager() {
  return isAuthenticated() && (getUserRole() == 'manager' || getUserRole() == 'admin');
}

function isTeamMember() {
  return isAuthenticated() && (getUserRole() in ['team-member', 'manager', 'admin']);
}
3. Ownership Validation
function isOwnerOrAssigned(resource) {
  return isAuthenticated() && 
    (resource.data.assignedTo == request.auth.token.email || 
     resource.data.createdBy == request.auth.uid ||
     isManager());
}
4. Data Validation
All documents require createdAt and updatedAt timestamps
Email format validation using regex
Numeric field validation (positive amounts, valid percentages)
Enum validation for status, priority, and type fields
5. Audit Trail
Audit logs collection is read-only for admins
System-generated logs cannot be modified by users
Deployment Instructions
Install Firebase CLI:
npm install -g firebase-tools
Login to Firebase:
firebase login
Initialize Firebase in your project:
firebase init firestore
Deploy the rules:
firebase deploy --only firestore:rules
Test the rules:
firebase emulators:start --only firestore
Testing Security Rules
Use the Firebase Emulator Suite to test rules:

# Start emulator
firebase emulators:start --only firestore

# Run tests
npm test
Example test scenarios:

Team member creating finance record
Manager approving finance record
Investor reading approved income
Unauthorized access attempts
Common Issues and Solutions
Permission Denied Errors:

Check user authentication status
Verify user role in /users/{uid} document
Ensure required fields are present
Validation Failures:

Check data types match rule requirements
Verify enum values are correct
Ensure timestamps are properly formatted
Role Assignment:

Users must have a document in /users/{uid} with role field
Roles: ‘admin’, ‘manager’, ‘team-member’, ‘investor’
Security Best Practices
Principle of Least Privilege: Users only get minimum required access
Data Validation: All input is validated before storage
Audit Logging: All sensitive operations are logged
Role Separation: Financial data requires higher privileges
Email Verification: User emails should be verified before role assignment
Monitoring and Maintenance
Regular Security Reviews: Review rules quarterly
Access Monitoring: Monitor unusual access patterns
Rule Testing: Test rules with each deployment
User Management: Regularly audit user roles and permissions