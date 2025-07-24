import React, { useMemo } from 'react';
import { Task } from '../types/Task';

interface GanttChartProps {
  tasks: Task[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const { timelineData, dateRange } = useMemo(() => {
    if (tasks.length === 0) {
      return { timelineData: [], dateRange: { start: new Date(), end: new Date() } };
    }

    const dates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    const timelineData = tasks.map(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const taskDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const startOffset = Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        startOffset: (startOffset / totalDays) * 100,
        width: (taskDuration / totalDays) * 100,
        duration: taskDuration,
      };
    });

    return {
      timelineData,
      dateRange: { start: minDate, end: maxDate, totalDays }
    };
  }, [tasks]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-orange-400';
      case 'doing': return 'bg-green-500';
      case 'done': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-orange-400';
    }
  };

  const getPriorityIntensity = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'opacity-100 ring-2 ring-red-300';
      case 'high': return 'opacity-90';
      case 'medium': return 'opacity-75';
      case 'low': return 'opacity-60';
      default: return 'opacity-75';
    }
  };

  const generateWeekHeaders = () => {
    const headers = [];
    const currentDate = new Date(dateRange.start);
    
    while (currentDate <= dateRange.end) {
      headers.push({
        date: new Date(currentDate),
        week: `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
      });
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return headers;
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa para mostrar</h3>
          <p className="text-gray-500">Adicione algumas tarefas para ver o gráfico Gantt</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Cronograma - Gantt</h2>
        <p className="text-sm text-gray-500 mt-1">
          Visualização temporal das tarefas ({tasks.length} tarefas)
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="w-80 flex-shrink-0 p-3 font-medium text-gray-700 border-r border-gray-200">
              Tarefa
            </div>
            <div className="flex-1 flex">
              {generateWeekHeaders().map((header, index) => (
                <div key={index} className="flex-1 p-2 text-center text-xs text-gray-600 border-r border-gray-200">
                  {header.week}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="divide-y divide-gray-100">
            {timelineData.map((task, index) => (
              <div key={task.id} className="flex hover:bg-gray-50 transition-colors">
                <div className="w-80 flex-shrink-0 p-3 border-r border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {task.assignee || 'Não atribuído'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 relative p-2">
                  <div
                    className={`
                      absolute top-3 h-6 rounded-full flex items-center justify-center
                      ${getStatusColor(task.status)} ${getPriorityIntensity(task.priority)}
                      transition-all duration-200 hover:scale-105
                    `}
                    style={{
                      left: `${task.startOffset}%`,
                      width: `${Math.max(task.width, 2)}%`,
                    }}
                    title={`${task.title} - ${task.duration} dia${task.duration > 1 ? 's' : ''}`}
                  >
                    {task.width > 15 && (
                      <span className="text-white text-xs font-medium px-2 truncate">
                        {task.duration}d
                      </span>
                    )}
                  </div>
                  
                  {/* Progress indicator */}
                  {task.progress > 0 && (
                    <div
                      className="absolute top-3 h-6 bg-white bg-opacity-30 rounded-full"
                      style={{
                        left: `${task.startOffset}%`,
                        width: `${(task.width * task.progress) / 100}%`,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span>A Fazer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Fazendo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Feito</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Atrasado</span>
            </div>
          </div>
          <div className="text-gray-500">
            Período: {dateRange.start.toLocaleDateString('pt-BR')} - {dateRange.end.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
};