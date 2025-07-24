import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, Column } from '../types/Task';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

const columns: Column[] = [
  { id: 'todo', title: 'A Fazer', status: 'todo', color: 'bg-orange-50 border-orange-200', tasks: [] },
  { id: 'doing', title: 'Fazendo', status: 'doing', color: 'bg-green-50 border-green-200', tasks: [] },
  { id: 'done', title: 'Feito', status: 'done', color: 'bg-green-50 border-green-200', tasks: [] },
  { id: 'overdue', title: 'Atrasado', status: 'overdue', color: 'bg-red-50 border-red-200', tasks: [] },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, status);
    setDragOverColumn(null);
  };

  const getColumnStats = (status: Task['status']) => {
    const columnTasks = getTasksByStatus(status);
    return {
      total: columnTasks.length,
      urgent: columnTasks.filter(t => t.priority === 'urgent').length,
    };
  };

  return (
    <div className="flex space-x-6 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        const stats = getColumnStats(column.status);
        const isActive = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={`
              flex-shrink-0 w-80 rounded-lg border-2 transition-all duration-200
              ${column.color} ${isActive ? 'border-orange-400 bg-orange-100' : ''}
            `}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900 text-lg">
                  {column.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full font-medium">
                    {stats.total}
                  </span>
                  {stats.urgent > 0 && (
                    <span className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full font-medium">
                      {stats.urgent} urgente{stats.urgent > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              
              {column.status === 'todo' && (
                <button
                  onClick={onAddTask}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Adicionar Tarefa</span>
                </button>
              )}
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    isDragOver={isActive}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};