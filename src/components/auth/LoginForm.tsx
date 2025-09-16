import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/lib/auth';
import { toast } from 'sonner';
import { Eye, EyeOff, Building, Users, TrendingUp, FileText } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const demoAccounts = [
    { email: 'admin@college.edu', password: 'admin123', role: 'Administrator', icon: Building },
    { email: 'manager@college.edu', password: 'manager123', role: 'Project Manager', icon: Users },
    { email: 'investor@college.edu', password: 'investor123', role: 'Investor', icon: TrendingUp },
    { email: 'team@college.edu', password: 'team123', role: 'Team Member', icon: FileText }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.signIn(email, password);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    try {
      await AuthService.signIn(demoEmail, demoPassword);
      toast.success('Demo login successful!');
    } catch (error) {
      console.error('Demo login failed:', error);
      toast.error('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Bashurhat College
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-blue-600 mb-6">
              Project Management System
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
              Comprehensive project management platform for college establishment, 
              budget tracking, and team collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Project Planning</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Budget Tracking</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Team Management</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Document Control</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center">
          <Card className="w-full max-w-md mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access the project management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Try Demo Accounts
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {demoAccounts.map((account) => {
                    const Icon = account.icon;
                    return (
                      <Button
                        key={account.email}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2"
                        onClick={() => handleDemoLogin(account.email, account.password)}
                        disabled={loading}
                      >
                        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{account.role}</div>
                          <div className="text-xs text-muted-foreground truncate">{account.email}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}