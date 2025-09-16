// Firebase Security Rules and Configuration
// This file contains the security rules and configuration for Firebase services

export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Project documents - role-based access
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'project_manager']);
    }
    
    // Tasks - authenticated users can read, specific roles can write
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'project_manager', 'team_member']);
    }
    
    // Financial data - restricted access
    match /finances/{financeId} {
      allow read: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'project_manager', 'investor']);
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'project_manager']);
    }
    
    // Documents - role-based access
    match /documents/{documentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'project_manager']);
    }
  }
}`;

export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Documents folder - authenticated users can read, specific roles can write
    match /documents/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'project_manager'];
    }
    
    // Profile pictures - users can manage their own
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

// Audit logging function
export async function logAuditEvent(event: string, userId?: string, details?: any): Promise<void> {
  try {
    const auditLog = {
      event,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      details: details || {},
      ip: 'unknown', // In a real app, this would be captured from request
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
    
    console.log('🔍 Audit Log:', auditLog);
    
    // In a real implementation, this would write to Firestore
    // await addDoc(collection(db, 'audit_logs'), auditLog);
  } catch (error) {
    console.warn('Failed to log audit event:', error);
  }
}

// Initialize Firebase security rules (mock implementation)
export async function initializeFirebaseRules(): Promise<boolean> {
  try {
    // In a real implementation, these rules would be deployed to Firebase
    // For now, we'll just log them and return success
    console.log('🔒 Firestore Security Rules:', firestoreRules.length, 'characters');
    console.log('🔒 Storage Security Rules:', storageRules.length, 'characters');
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Firebase rules:', error);
    return false;
  }
}

// GDPR Compliance Configuration
export const gdprConfig = {
  dataRetentionPeriod: 365, // days
  anonymizationEnabled: true,
  auditLogging: true,
  encryptionAtRest: true,
  rightToBeforgotten: true,
  dataPortability: true,
  consentManagement: true,
};

// Security Configuration
export const securityConfig = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  sessionTimeout: 3600, // seconds
  maxLoginAttempts: 5,
  lockoutDuration: 900, // seconds (15 minutes)
  twoFactorAuth: false, // Can be enabled later
};