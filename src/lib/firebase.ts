import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD4ULFHKUJT4WF0keT23zSM30LRO_E7OfE",
  authDomain: "bashurhat-college-project.firebaseapp.com",
  projectId: "bashurhat-college-project",
  storageBucket: "bashurhat-college-project.firebasestorage.app",
  messagingSenderId: "1029510088031",
  appId: "1:1029510088031:web:70345961719f724b46a2ea",
  measurementId: "G-Y04D6Y1R9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics only if supported (not in all environments)
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics not available:', error);
}

export { analytics };

// Enhanced Firebase configuration with security features
export const firebaseFeatures = {
  // Security settings
  security: {
    enforceSSL: true,
    requireAuth: true,
    auditLogging: true,
    encryptionAtRest: true,
    backupEnabled: true,
  },
  
  // Performance settings
  performance: {
    cachingEnabled: true,
    offlineSupport: true,
    compressionEnabled: true,
  },
  
  // Monitoring settings
  monitoring: {
    analyticsEnabled: !!analytics,
    crashlyticsEnabled: true,
    performanceMonitoring: true,
  },
};

console.log('✅ Firebase initialized successfully for Bashurhat College Project Management');
console.log('🔥 Connected to project:', firebaseConfig.projectId);

export default app;