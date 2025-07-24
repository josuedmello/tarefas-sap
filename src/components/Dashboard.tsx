import React, { useMemo } from 'react';
import { BarChart3, Clock, CheckCircle, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { Task } from '../types/Task';

interface DashboardProps {
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'doing').length;
    const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
    const urgentTasks = tasks.filter(t => t.priority === 'urgent').length;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const assignees = [...new Set(tasks.filter(t => t.assignee).map(t => t.assignee))];
    
    const avgProgress = totalTasks > 0 
      ? tasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks 
      : 0;

    const priorityDistribution = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    const statusDistribution = {
      todo: tasks.filter(t => t.status === 'todo').length,
      doing: tasks.filter(t => t.status === 'doing').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
    };

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      urgentTasks,
      completionRate,
      assignees: assignees.length,
      avgProgress,
      priorityDistribution,
      statusDistribution,
    };
  }, [tasks]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color }: {
    label: string;
    value: number;
    total: number;
    color: string;
  }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{value} ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BarChart3}
          title="Total de Tarefas"
          value={stats.totalTasks}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={CheckCircle}
          title="Concluídas"
          value={stats.completedTasks}
          subtitle={`${stats.completionRate.toFixed(1)}% do total`}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={Clock}
          title="Em Andamento"
          value={stats.inProgressTasks}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={AlertTriangle}
          title="Atrasadas"
          value={stats.overdueTasks}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={AlertTriangle}
          title="Urgentes"
          value={stats.urgentTasks}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          icon={Users}
          title="Responsáveis"
          value={stats.assignees}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={TrendingUp}
          title="Progresso Médio"
          value={`${stats.avgProgress.toFixed(1)}%`}
          color="text-indigo-600"
          bgColor="bg-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
          <div className="space-y-3">
            <ProgressBar
              label="A Fazer"
              value={stats.statusDistribution.todo}
              total={stats.totalTasks}
              color="bg-gray-400"
            />
            <ProgressBar
              label="Fazendo"
              value={stats.statusDistribution.doing}
              total={stats.totalTasks}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Feito"
              value={stats.statusDistribution.done}
              total={stats.totalTasks}
              color="bg-green-500"
            />
            <ProgressBar
              label="Atrasado"
              value={stats.statusDistribution.overdue}
              total={stats.totalTasks}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Prioridade</h3>
          <div className="space-y-3">
            <ProgressBar
              label="Baixa"
              value={stats.priorityDistribution.low}
              total={stats.totalTasks}
              color="bg-blue-400"
            />
            <ProgressBar
              label="Média"
              value={stats.priorityDistribution.medium}
              total={stats.totalTasks}
              color="bg-yellow-400"
            />
            <ProgressBar
              label="Alta"
              value={stats.priorityDistribution.high}
              total={stats.totalTasks}
              color="bg-orange-400"
            />
            <ProgressBar
              label="Urgente"
              value={stats.priorityDistribution.urgent}
              total={stats.totalTasks}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats.totalTasks > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Projeto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.completionRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Taxa de Conclusão</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.avgProgress.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Progresso Médio</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.assignees}</div>
              <div className="text-sm text-gray-600">Pessoas Envolvidas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};