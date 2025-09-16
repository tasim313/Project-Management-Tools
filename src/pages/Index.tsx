import React from 'react';
import { AuthService } from '@/lib/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User } from '@/types/user';

export default function Index() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading Bashurhat College System...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <DashboardLayout user={user} />;
}