export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  progress: number;
}

export interface Column {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}