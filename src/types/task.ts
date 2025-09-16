export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  reporterId: string;
  reporterName: string;
  projectId: string;
  milestoneId?: string;
  tags: string[];
  estimatedHours: number;
  actualHours?: number;
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  dependencies: string[]; // Array of task IDs
  attachments: string[]; // Array of file URLs
  comments: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
  progress: number; // 0-100
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  projectId: string;
  targetDate: Date;
  completedDate?: Date;
  isCompleted: boolean;
  tasks: string[]; // Array of task IDs
  dependencies: string[]; // Array of milestone IDs
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  managerId: string;
  managerName: string;
  teamMembers: string[]; // Array of user IDs
  startDate: Date;
  endDate: Date;
  budget: number;
  spentAmount: number;
  progress: number; // 0-100
  milestones: string[]; // Array of milestone IDs
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
}