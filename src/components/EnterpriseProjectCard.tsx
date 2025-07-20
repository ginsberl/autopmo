import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Code, TestTube, CheckCircle } from 'lucide-react';
import ProcessStageIndicator from './ProcessStageIndicator';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'active' | 'completed' | 'draft' | 'blocked';
  owner?: string;
  x0Status: 'uploaded' | 'pending' | 'none';
  x1Status: 'completed' | 'in-progress' | 'pending';
  userStoriesStatus: 'completed' | 'in-progress' | 'pending';
  codeStatus: 'completed' | 'in-progress' | 'pending';
  testingStatus: 'completed' | 'in-progress' | 'pending';
}

interface EnterpriseProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const EnterpriseProjectCard: React.FC<EnterpriseProjectCardProps> = ({ project, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stages = [
    {
      id: 'x0',
      name: 'X0 Upload',
      status: project.x0Status === 'uploaded' ? 'completed' : project.x0Status === 'pending' ? 'in-progress' : 'pending',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'x1',
      name: 'X1 Document',
      status: project.x1Status,
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'stories',
      name: 'User Stories',
      status: project.userStoriesStatus,
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'code',
      name: 'Code Gen',
      status: project.codeStatus,
      icon: <Code className="w-4 h-4" />
    },
    {
      id: 'testing',
      name: 'Testing',
      status: project.testingStatus,
      icon: <TestTube className="w-4 h-4" />
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(project)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProcessStageIndicator stages={stages} />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
            {project.owner && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {project.owner}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseProjectCard;