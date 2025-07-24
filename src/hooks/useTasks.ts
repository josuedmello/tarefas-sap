import { useState, useEffect } from 'react';
import { Task, Project } from '../types/Task';

const STORAGE_KEY = 'task-management-data';

export const useTasks = () => {
  const [project, setProject] = useState<Project>({
    id: '1',
    name: 'Meu Projeto',
    description: 'Sistema de controle de tarefas',
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setProject(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever project changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProject(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteTask = (taskId: string) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  // Check for overdue tasks
  const checkOverdueTasks = () => {
    const now = new Date();
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        const endDate = new Date(task.endDate);
        if (endDate < now && task.status !== 'done') {
          return { ...task, status: 'overdue' as Task['status'] };
        }
        return task;
      }),
    }));
  };

  useEffect(() => {
    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return {
    project,
    setProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
};