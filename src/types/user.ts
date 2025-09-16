export type UserRole = 'admin' | 'project_manager' | 'team_member' | 'investor';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  permissions: string[];
  lastLogin?: Date;
}

export interface UserProfile extends User {
  bio?: string;
  skills?: string[];
  projects?: string[];
  investmentAmount?: number; // For investors
  managedProjects?: string[]; // For project managers
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RolePermissions {
  [key: string]: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canExport: boolean;
    canManageUsers: boolean;
    canViewFinancials: boolean;
    canApproveExpenses: boolean;
  };
}

export const DEFAULT_PERMISSIONS: RolePermissions = {
  admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canExport: true,
    canManageUsers: true,
    canViewFinancials: true,
    canApproveExpenses: true,
  },
  project_manager: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canExport: true,
    canManageUsers: false,
    canViewFinancials: true,
    canApproveExpenses: true,
  },
  team_member: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canExport: false,
    canManageUsers: false,
    canViewFinancials: false,
    canApproveExpenses: false,
  },
  investor: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canExport: true,
    canManageUsers: false,
    canViewFinancials: true,
    canApproveExpenses: false,
  },
};