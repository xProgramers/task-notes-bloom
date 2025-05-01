
export type TaskStatus = 'pending' | 'completed' | 'rescheduled';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'yearly';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  completed: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  recurrence?: TaskRecurrence;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  completed: number;
  pending: number;
  rescheduled: number;
  total: number;
  completionRate: number;
}
