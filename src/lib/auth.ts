import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    User as FirebaseUser
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, db } from './firebase';
  import { User, UserRole } from '@/types/user';
  import { logAuditEvent } from './firebase-rules';
  
  // Demo users for offline mode
  const DEMO_USERS = [
    {
      uid: 'demo-admin',
      email: 'admin@college.edu',
      password: 'admin123',
      displayName: 'Administrator',
      role: 'admin' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: ['users:read', 'users:write', 'projects:read', 'projects:write', 'tasks:read', 'tasks:write', 'finances:read', 'finances:write']
    },
    {
      uid: 'demo-manager',
      email: 'manager@college.edu',
      password: 'manager123',
      displayName: 'Project Manager',
      role: 'project_manager' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: ['projects:read', 'projects:write', 'tasks:read', 'tasks:write', 'finances:read']
    },
    {
      uid: 'demo-investor',
      email: 'investor@college.edu',
      password: 'investor123',
      displayName: 'Investor',
      role: 'investor' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: ['finances:read', 'projects:read']
    },
    {
      uid: 'demo-team',
      email: 'team@college.edu',
      password: 'team123',
      displayName: 'Team Member',
      role: 'team_member' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: ['tasks:read', 'tasks:write', 'projects:read']
    }
  ];
  
  export class AuthService {
    private static currentUser: User | null = null;
    private static authListeners: ((user: User | null) => void)[] = [];
    private static firebaseEnabled = false;
  
    // Check if Firebase is properly configured
    private static async checkFirebaseConfig(): Promise<boolean> {
      try {
        // Try to access Firebase auth
        if (!auth) return false;
        
        // Test Firebase connection
        await new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, 
            (user) => {
              unsubscribe();
              resolve(user);
            },
            (error) => {
              unsubscribe();
              reject(error);
            }
          );
          
          // Timeout after 3 seconds
          setTimeout(() => {
            unsubscribe();
            reject(new Error('Firebase timeout'));
          }, 3000);
        });
        
        this.firebaseEnabled = true;
        return true;
      } catch (error) {
        console.warn('Firebase not available, using offline mode:', error);
        this.firebaseEnabled = false;
        return false;
      }
    }
  
    // Initialize authentication
    static async initialize(): Promise<void> {
      const isFirebaseAvailable = await this.checkFirebaseConfig();
      
      if (isFirebaseAvailable) {
        console.log('✅ Firebase authentication enabled');
        // Set up Firebase auth listener
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const user = await this.getOrCreateUserProfile(firebaseUser);
            this.setCurrentUser(user);
          } else {
            this.setCurrentUser(null);
          }
        });
      } else {
        console.log('⚠️ Using offline authentication mode');
        // Check for stored user in localStorage
        const storedUser = localStorage.getItem('demo_current_user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            this.setCurrentUser(user);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
          }
        }
      }
    }
  
    // Sign in with email and password
    static async signIn(email: string, password: string): Promise<User> {
      try {
        if (this.firebaseEnabled) {
          // Use Firebase authentication
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = await this.getOrCreateUserProfile(userCredential.user);
          await logAuditEvent('user_login', user.uid, { email });
          return user;
        } else {
          // Use demo authentication
          const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
          if (!demoUser) {
            throw new Error('Invalid credentials');
          }
          
          const user: User = {
            uid: demoUser.uid,
            email: demoUser.email,
            displayName: demoUser.displayName,
            role: demoUser.role,
            createdAt: demoUser.createdAt,
            updatedAt: new Date(),
            isActive: demoUser.isActive,
            permissions: demoUser.permissions
          };
          
          // Store in localStorage for persistence
          localStorage.setItem('demo_current_user', JSON.stringify(user));
          this.setCurrentUser(user);
          await logAuditEvent('demo_login', user.uid, { email });
          
          return user;
        }
      } catch (error: any) {
        console.error('Sign in error:', error);
        throw new Error(error.message || 'Failed to sign in');
      }
    }
  
    // Sign out
    static async signOut(): Promise<void> {
      try {
        if (this.firebaseEnabled && auth.currentUser) {
          await signOut(auth);
        }
        
        // Clear localStorage
        localStorage.removeItem('demo_current_user');
        this.setCurrentUser(null);
        await logAuditEvent('user_logout', this.currentUser?.uid || 'unknown');
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    }
  
    // Create demo users (for Firebase setup)
    static async createDemoUsers(): Promise<void> {
      if (!this.firebaseEnabled) {
        console.log('Demo users already available in offline mode');
        return;
      }
  
      try {
        for (const demoUser of DEMO_USERS) {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, demoUser.email, demoUser.password);
            await this.createUserProfile(userCredential.user, {
              role: demoUser.role,
              displayName: demoUser.displayName,
              permissions: demoUser.permissions
            });
            console.log(`✅ Created demo user: ${demoUser.email}`);
          } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
              console.log(`ℹ️ Demo user already exists: ${demoUser.email}`);
            } else {
              console.error(`❌ Failed to create demo user ${demoUser.email}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to create demo users:', error);
        throw error;
      }
    }
  
    // Get or create user profile
    private static async getOrCreateUserProfile(firebaseUser: FirebaseUser): Promise<User> {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: userData.displayName || firebaseUser.displayName || 'User',
            role: userData.role || 'team_member',
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: new Date(),
            isActive: userData.isActive ?? true,
            permissions: userData.permissions || ['tasks:read']
          };
        } else {
          // Create new user profile
          return await this.createUserProfile(firebaseUser, {
            role: 'team_member',
            displayName: firebaseUser.displayName || 'User',
            permissions: ['tasks:read']
          });
        }
      } catch (error) {
        console.error('Failed to get user profile:', error);
        // Return basic user profile as fallback
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || 'User',
          role: 'team_member',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          permissions: ['tasks:read']
        };
      }
    }
  
    // Create user profile
    private static async createUserProfile(
      firebaseUser: FirebaseUser, 
      profileData: { role: UserRole; displayName: string; permissions: string[] }
    ): Promise<User> {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: profileData.displayName,
        role: profileData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        permissions: profileData.permissions
      };
  
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Failed to create user profile in Firestore:', error);
      }
  
      return user;
    }
  
    // Set current user and notify listeners
    private static setCurrentUser(user: User | null): void {
      this.currentUser = user;
      this.authListeners.forEach(listener => listener(user));
    }
  
    // Get current user
    static getCurrentUser(): User | null {
      return this.currentUser;
    }
  
    // Listen to auth state changes
    static onAuthStateChanged(callback: (user: User | null) => void): () => void {
      this.authListeners.push(callback);
      
      // Call immediately with current user
      callback(this.currentUser);
      
      // Return unsubscribe function
      return () => {
        const index = this.authListeners.indexOf(callback);
        if (index > -1) {
          this.authListeners.splice(index, 1);
        }
      };
    }
  
    // Get demo users list
    static getDemoUsers() {
      return DEMO_USERS.map(user => ({
        email: user.email,
        password: user.password,
        role: user.role,
        displayName: user.displayName
      }));
    }
  }
  
  // Initialize authentication when module loads
  AuthService.initialize().catch(error => {
    console.error('Failed to initialize AuthService:', error);
  });