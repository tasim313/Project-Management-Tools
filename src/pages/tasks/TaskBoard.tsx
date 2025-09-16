import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { TaskForm } from '@/components/forms/TaskForm';
import { TaskService, initializeSampleData } from '@/lib/data-service';
import { Task } from '@/types/task';
import { Plus, CheckSquare, Clock, AlertTriangle, User } from 'lucide-react';
import { toast } from 'sonner';

export default function TaskBoard() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      await initializeSampleData();
      const allTasks = await TaskService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      await TaskService.createTask(taskData);
      await loadTasks();
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id'>) => {
    if (!selectedTask) return;
    
    try {
      await TaskService.updateTask(selectedTask.id, taskData);
      await loadTasks();
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await TaskService.deleteTask(task.id);
      await loadTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'title' as keyof Task,
      label: 'Task',
      render: (value: string, task: Task) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{task.description}</div>
        </div>
      )
    },
    {
      key: 'status' as keyof Task,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusColor(value)}>
          {value.replace('-', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'priority' as keyof Task,
      label: 'Priority',
      render: (value: string) => (
        <Badge variant={getPriorityColor(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'assignee' as keyof Task,
      label: 'Assignee',
      render: (value: string) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          {value}
        </div>
      )
    },
    {
      key: 'dueDate' as keyof Task,
      label: 'Due Date',
      render: (value: Date) => (
        <div>{value ? new Date(value).toLocaleDateString() : 'No due date'}</div>
      )
    },
    {
      key: 'tags' as keyof Task,
      label: 'Tags',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      )
    }
  ];

  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Create, track, and manage project tasks</p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{taskStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            Create, edit, and manage project tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tasks}
            columns={columns}
            onAdd={handleAddTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            addLabel="Create Task"
          />
        </CardContent>
      </Card>

      {/* Task Form Dialog */}
      <TaskForm
        task={selectedTask}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}