import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    getDoc, 
    query, 
    where, 
    orderBy,
    serverTimestamp,
    Timestamp
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { Task } from '@/types/task';
  import { User } from '@/types/user';
  import { FinanceRecord } from '@/types/finance';
  import { Lead } from '@/types/lead';
  
  // Local storage keys for offline fallback
  const STORAGE_KEYS = {
    TASKS: 'project_tasks',
    USERS: 'project_users',
    FINANCES: 'project_finances',
    DOCUMENTS: 'project_documents',
    PROJECTS: 'project_projects',
    LEADS: 'project_leads',
    MEETINGS: 'project_meetings'
  };
  
  // Check if Firebase is available
  const isFirebaseAvailable = () => {
    try {
      return !!db;
    } catch {
      return false;
    }
  };
  
  // Convert Firestore timestamps to Date objects
  const convertTimestamps = (data: any): any => {
    if (!data) return data;
    
    const converted = { ...data };
    Object.keys(converted).forEach(key => {
      if (converted[key] instanceof Timestamp) {
        converted[key] = converted[key].toDate();
      } else if (converted[key] && typeof converted[key] === 'object' && converted[key].seconds) {
        // Handle Firestore timestamp-like objects
        converted[key] = new Date(converted[key].seconds * 1000);
      }
    });
    
    return converted;
  };
  
  // Generic data service for CRUD operations
  export class DataService {
    // Create new record
    static async create<T extends Record<string, any>>(
      collectionName: string, 
      data: Omit<T, 'id'>
    ): Promise<T> {
      const newData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
  
      if (isFirebaseAvailable()) {
        try {
          const docRef = await addDoc(collection(db, collectionName), newData);
          const createdDoc = await getDoc(docRef);
          const docData = createdDoc.data();
          
          return convertTimestamps({
            id: docRef.id,
            ...docData
          }) as T;
        } catch (error) {
          console.warn('Firebase create failed, using localStorage:', error);
        }
      }
  
      // Fallback to localStorage
      const fallbackData = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      } as T;
  
      const storageKey = this.getStorageKey(collectionName);
      const existing = this.getFromStorage<T>(storageKey);
      existing.push(fallbackData);
      localStorage.setItem(storageKey, JSON.stringify(existing));
      
      return fallbackData;
    }
  
    // Read all records
    static async readAll<T>(collectionName: string): Promise<T[]> {
      if (isFirebaseAvailable()) {
        try {
          const querySnapshot = await getDocs(
            query(collection(db, collectionName), orderBy('createdAt', 'desc'))
          );
          
          return querySnapshot.docs.map(doc => convertTimestamps({
            id: doc.id,
            ...doc.data()
          })) as T[];
        } catch (error) {
          console.warn('Firebase read failed, using localStorage:', error);
        }
      }
  
      // Fallback to localStorage
      const storageKey = this.getStorageKey(collectionName);
      return this.getFromStorage<T>(storageKey);
    }
  
    // Read single record
    static async readOne<T>(collectionName: string, id: string): Promise<T | null> {
      if (isFirebaseAvailable()) {
        try {
          const docRef = doc(db, collectionName, id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            return convertTimestamps({
              id: docSnap.id,
              ...docSnap.data()
            }) as T;
          }
        } catch (error) {
          console.warn('Firebase read one failed, using localStorage:', error);
        }
      }
  
      // Fallback to localStorage
      const storageKey = this.getStorageKey(collectionName);
      const items = this.getFromStorage<T>(storageKey);
      return items.find((item: any) => item.id === id) || null;
    }
  
    // Update record
    static async update<T extends Record<string, any>>(
      collectionName: string, 
      id: string, 
      updates: Partial<T>
    ): Promise<T> {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
  
      if (isFirebaseAvailable()) {
        try {
          const docRef = doc(db, collectionName, id);
          await updateDoc(docRef, updateData);
          
          const updated = await this.readOne<T>(collectionName, id);
          if (updated) return updated;
        } catch (error) {
          console.warn('Firebase update failed, using localStorage:', error);
        }
      }
  
      // Fallback to localStorage
      const storageKey = this.getStorageKey(collectionName);
      const items = this.getFromStorage<T>(storageKey);
      const index = items.findIndex((item: any) => item.id === id);
      
      if (index !== -1) {
        items[index] = { 
          ...items[index], 
          ...updates,
          updatedAt: new Date()
        };
        localStorage.setItem(storageKey, JSON.stringify(items));
        return items[index];
      }
      
      throw new Error(`Record with id ${id} not found`);
    }
  
    // Delete record
    static async delete(collectionName: string, id: string): Promise<void> {
      if (isFirebaseAvailable()) {
        try {
          await deleteDoc(doc(db, collectionName, id));
          return;
        } catch (error) {
          console.warn('Firebase delete failed, using localStorage:', error);
        }
      }
  
      // Fallback to localStorage
      const storageKey = this.getStorageKey(collectionName);
      const items = this.getFromStorage(storageKey);
      const filtered = items.filter((item: any) => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
    }
  
    // Query records with conditions
    static async query<T>(
      collectionName: string,
      conditions: Array<{ field: string; operator: any; value: any }>
    ): Promise<T[]> {
      if (isFirebaseAvailable()) {
        try {
          let q = collection(db, collectionName);
          
          conditions.forEach(condition => {
            q = query(q as any, where(condition.field, condition.operator, condition.value)) as any;
          });
          
          const querySnapshot = await getDocs(q as any);
          return querySnapshot.docs.map(doc => convertTimestamps({
            id: doc.id,
            ...doc.data()
          })) as T[];
        } catch (error) {
          console.warn('Firebase query failed, using localStorage:', error);
        }
      }
  
      // Fallback to localStorage with basic filtering
      const allItems = await this.readAll<T>(collectionName);
      return allItems.filter((item: any) => {
        return conditions.every(condition => {
          const fieldValue = item[condition.field];
          switch (condition.operator) {
            case '==':
              return fieldValue === condition.value;
            case '!=':
              return fieldValue !== condition.value;
            case '>':
              return fieldValue > condition.value;
            case '>=':
              return fieldValue >= condition.value;
            case '<':
              return fieldValue < condition.value;
            case '<=':
              return fieldValue <= condition.value;
            case 'array-contains':
              return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
            default:
              return true;
          }
        });
      });
    }
  
    // Helper methods
    private static generateId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  
    private static getStorageKey(collectionName: string): string {
      return STORAGE_KEYS[collectionName.toUpperCase() as keyof typeof STORAGE_KEYS] || `project_${collectionName}`;
    }
  
    private static getFromStorage<T>(key: string): T[] {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    }
  }
  
  // Specific service classes for different data types
  export class TaskService {
    static async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
      return DataService.create<Task>('tasks', taskData);
    }
  
    static async getAllTasks(): Promise<Task[]> {
      return DataService.readAll<Task>('tasks');
    }
  
    static async getTask(id: string): Promise<Task | null> {
      return DataService.readOne<Task>('tasks', id);
    }
  
    static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
      return DataService.update<Task>('tasks', id, updates);
    }
  
    static async deleteTask(id: string): Promise<void> {
      return DataService.delete('tasks', id);
    }
  
    static async getTasksByStatus(status: string): Promise<Task[]> {
      return DataService.query<Task>('tasks', [
        { field: 'status', operator: '==', value: status }
      ]);
    }
  
    static async getTasksByAssignee(assignee: string): Promise<Task[]> {
      return DataService.query<Task>('tasks', [
        { field: 'assignee', operator: '==', value: assignee }
      ]);
    }
  }
  
  export class FinanceService {
    static async createRecord(data: Omit<FinanceRecord, 'id'>): Promise<FinanceRecord> {
      return DataService.create<FinanceRecord>('finances', data);
    }
  
    static async getAllRecords(): Promise<FinanceRecord[]> {
      return DataService.readAll<FinanceRecord>('finances');
    }
  
    static async updateRecord(id: string, updates: Partial<FinanceRecord>): Promise<FinanceRecord> {
      return DataService.update<FinanceRecord>('finances', id, updates);
    }
  
    static async deleteRecord(id: string): Promise<void> {
      return DataService.delete('finances', id);
    }
  
    static async getRecordsByType(type: string): Promise<FinanceRecord[]> {
      return DataService.query<FinanceRecord>('finances', [
        { field: 'type', operator: '==', value: type }
      ]);
    }
  
    static async getRecordsByDateRange(startDate: Date, endDate: Date): Promise<FinanceRecord[]> {
      return DataService.query<FinanceRecord>('finances', [
        { field: 'date', operator: '>=', value: startDate },
        { field: 'date', operator: '<=', value: endDate }
      ]);
    }
  }
  
  export class LeadService {
    static async createLead(leadData: Omit<Lead, 'id'>): Promise<Lead> {
      return DataService.create<Lead>('leads', leadData);
    }
  
    static async getAllLeads(): Promise<Lead[]> {
      return DataService.readAll<Lead>('leads');
    }
  
    static async getLead(id: string): Promise<Lead | null> {
      return DataService.readOne<Lead>('leads', id);
    }
  
    static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
      return DataService.update<Lead>('leads', id, updates);
    }
  
    static async deleteLead(id: string): Promise<void> {
      return DataService.delete('leads', id);
    }
  
    static async getLeadsByStatus(status: string): Promise<Lead[]> {
      return DataService.query<Lead>('leads', [
        { field: 'status', operator: '==', value: status }
      ]);
    }
  
    static async getLeadsByAssignee(assignee: string): Promise<Lead[]> {
      return DataService.query<Lead>('leads', [
        { field: 'assignedTo', operator: '==', value: assignee }
      ]);
    }
  
    static async getHighValueLeads(minValue: number): Promise<Lead[]> {
      return DataService.query<Lead>('leads', [
        { field: 'estimatedValue', operator: '>=', value: minValue }
      ]);
    }
  }
  
  export class UserService {
    static async createUser(userData: Omit<User, 'uid'>): Promise<User> {
      return DataService.create<User>('users', userData);
    }
  
    static async getAllUsers(): Promise<User[]> {
      return DataService.readAll<User>('users');
    }
  
    static async updateUser(id: string, updates: Partial<User>): Promise<User> {
      return DataService.update<User>('users', id, updates);
    }
  
    static async deleteUser(id: string): Promise<void> {
      return DataService.delete('users', id);
    }
  
    static async getUsersByRole(role: string): Promise<User[]> {
      return DataService.query<User>('users', [
        { field: 'role', operator: '==', value: role }
      ]);
    }
  }
  
  // Meeting service
  export class MeetingService {
    static async createMeeting(meetingData: any): Promise<any> {
      return DataService.create('meetings', meetingData);
    }
  
    static async getAllMeetings(): Promise<any[]> {
      return DataService.readAll('meetings');
    }
  
    static async updateMeeting(id: string, updates: any): Promise<any> {
      return DataService.update('meetings', id, updates);
    }
  
    static async deleteMeeting(id: string): Promise<void> {
      return DataService.delete('meetings', id);
    }
  
    static async getMeetingsByStatus(status: string): Promise<any[]> {
      return DataService.query('meetings', [
        { field: 'status', operator: '==', value: status }
      ]);
    }
  }
  
  // Document service
  export class DocumentService {
    static async createDocument(docData: any): Promise<any> {
      return DataService.create('documents', docData);
    }
  
    static async getAllDocuments(): Promise<any[]> {
      return DataService.readAll('documents');
    }
  
    static async updateDocument(id: string, updates: any): Promise<any> {
      return DataService.update('documents', id, updates);
    }
  
    static async deleteDocument(id: string): Promise<void> {
      return DataService.delete('documents', id);
    }
  }
  
  // Initialize with sample data if empty
  export const initializeSampleData = async () => {
    try {
      const tasks = await TaskService.getAllTasks();
      const finances = await FinanceService.getAllRecords();
      const leads = await LeadService.getAllLeads();
      const meetings = await MeetingService.getAllMeetings();
      
      // Initialize tasks if empty
      if (tasks.length === 0) {
        const sampleTasks = [
          {
            title: 'Land Acquisition Documentation',
            description: 'Complete legal documentation for college land purchase',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Legal Team',
            dueDate: new Date('2024-12-31'),
            tags: ['legal', 'land', 'documentation'],
            category: 'Legal'
          },
          {
            title: 'Building Design Approval',
            description: 'Get architectural plans approved by local authorities',
            status: 'pending',
            priority: 'high',
            assignee: 'Project Manager',
            dueDate: new Date('2024-11-30'),
            tags: ['design', 'approval', 'architecture'],
            category: 'Regulatory'
          },
          {
            title: 'Faculty Recruitment Plan',
            description: 'Develop comprehensive faculty hiring strategy',
            status: 'completed',
            priority: 'medium',
            assignee: 'HR Team',
            dueDate: new Date('2024-10-15'),
            tags: ['hr', 'faculty', 'recruitment'],
            category: 'Human Resources'
          }
        ];
  
        for (const task of sampleTasks) {
          await TaskService.createTask(task);
        }
      }
  
      // Initialize finance records if empty
      if (finances.length === 0) {
        const sampleFinances = [
          {
            type: 'income',
            category: 'Investment',
            amount: 5000000,
            description: 'Initial funding from government grant',
            date: new Date('2024-01-15')
          },
          {
            type: 'expense',
            category: 'Land',
            amount: 2500000,
            description: 'Land purchase for college campus',
            date: new Date('2024-02-20')
          },
          {
            type: 'expense',
            category: 'Construction',
            amount: 1500000,
            description: 'Initial construction phase payment',
            date: new Date('2024-03-10')
          }
        ];
  
        for (const finance of sampleFinances) {
          await FinanceService.createRecord(finance);
        }
      }
  
      // Initialize leads if empty
      if (leads.length === 0) {
        const sampleLeads = [
          {
            name: 'Ahmed Rahman',
            email: 'ahmed.rahman@business.com',
            phone: '+8801712345678',
            company: 'Rahman Enterprises',
            position: 'Managing Director',
            source: 'referral',
            status: 'qualified',
            priority: 'high',
            estimatedValue: 5000000,
            notes: 'Interested in investing in educational sector.',
            tags: ['investor', 'education', 'high-value'],
            assignedTo: 'manager@college.edu',
            createdAt: new Date(),
            updatedAt: new Date(),
            conversionProbability: 75
          },
          {
            name: 'Fatima Begum',
            email: 'fatima@techsolutions.bd',
            phone: '+8801987654321',
            company: 'Tech Solutions BD',
            position: 'CEO',
            source: 'website',
            status: 'contacted',
            priority: 'medium',
            estimatedValue: 2000000,
            notes: 'Partnership opportunities in technology infrastructure.',
            tags: ['technology', 'partnership'],
            assignedTo: 'team@college.edu',
            createdAt: new Date(),
            updatedAt: new Date(),
            conversionProbability: 60
          }
        ];
  
        for (const lead of sampleLeads) {
          await LeadService.createLead(lead);
        }
      }
  
      // Initialize meetings if empty
      if (meetings.length === 0) {
        const sampleMeetings = [
          {
            title: 'Project Kickoff Meeting',
            description: 'Initial project planning and team introduction',
            date: new Date('2024-11-25'),
            time: '10:00',
            duration: 90,
            location: 'Conference Room A',
            attendees: ['admin@college.edu', 'manager@college.edu'],
            status: 'scheduled',
            priority: 'high',
            agenda: 'Project overview and timeline discussion'
          },
          {
            title: 'Budget Review Meeting',
            description: 'Monthly budget review and expense analysis',
            date: new Date('2024-11-28'),
            time: '14:00',
            duration: 60,
            location: 'Finance Office',
            attendees: ['admin@college.edu', 'investor@college.edu'],
            status: 'scheduled',
            priority: 'medium',
            agenda: 'Review monthly expenses and budget variance'
          }
        ];
  
        for (const meeting of sampleMeetings) {
          await MeetingService.createMeeting(meeting);
        }
      }
  
      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };