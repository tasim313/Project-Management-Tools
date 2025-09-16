import React from 'react';
import { Sidebar } from './Sidebar';
import { AuthService } from '@/lib/auth';
import { User } from '@/types/user';
import Dashboard from '@/pages/dashboard/Dashboard';
import TaskBoard from '@/pages/tasks/TaskBoard';
import BudgetOverview from '@/pages/finance/BudgetOverview';
import InvestorDashboard from '@/pages/investor/InvestorDashboard';
import DocumentManager from '@/pages/documents/DocumentManager';
import ReportsPage from '@/pages/reports/ReportsPage';
import MeetingManager from '@/pages/meetings/MeetingManager';
import LeadManager from '@/pages/leads/LeadManager';

interface DashboardLayoutProps {
  user?: User;
}

export default function DashboardLayout({ user }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // If no user is provided, don't render the dashboard
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading user data...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskBoard />;
      case 'meetings':
        return <MeetingManager />;
      case 'leads':
        return <LeadManager />;
      case 'finance':
        return <BudgetOverview />;
      case 'investor':
        return <InvestorDashboard />;
      case 'documents':
        return <DocumentManager />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome, {user?.displayName || 'User'}
              </div>
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {user?.role?.replace('_', ' ').toUpperCase() || 'USER'}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

// Also export as named export for compatibility
export { DashboardLayout };