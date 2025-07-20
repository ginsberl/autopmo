import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, FileText, Code, TestTube } from 'lucide-react';

interface ProcessStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ReactNode;
}

interface ProcessStageIndicatorProps {
  stages: ProcessStage[];
}

const ProcessStageIndicator: React.FC<ProcessStageIndicatorProps> = ({ stages }) => {
  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getIcon = (status: string, icon: React.ReactNode) => {
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (status === 'in-progress') {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <Badge 
            variant="outline" 
            className={`flex items-center space-x-2 px-3 py-1 ${getStageColor(stage.status)}`}
          >
            {getIcon(stage.status, stage.icon)}
            <span className="text-xs font-medium">{stage.name}</span>
          </Badge>
          {index < stages.length - 1 && (
            <div className="w-2 h-px bg-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProcessStageIndicator;