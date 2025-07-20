import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';

interface ProjectMetricsProps {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  blockedProjects: number;
}

const ProjectMetrics: React.FC<ProjectMetricsProps> = ({
  totalProjects,
  completedProjects,
  inProgressProjects,
  blockedProjects
}) => {
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
  const progressRate = totalProjects > 0 ? (inProgressProjects / totalProjects) * 100 : 0;
  const blockedRate = totalProjects > 0 ? (blockedProjects / totalProjects) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{completionRate.toFixed(1)}% completion rate</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{inProgressProjects}</div>
          <Progress value={progressRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{progressRate.toFixed(1)}% in progress</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blocked</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{blockedProjects}</div>
          <Progress value={blockedRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{blockedRate.toFixed(1)}% blocked</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectMetrics;