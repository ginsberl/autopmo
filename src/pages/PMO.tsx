import React, { useState } from 'react';
import EnterpriseDashboard from '@/components/EnterpriseDashboard';
import ProjectDashboard from '@/components/ProjectDashboard';
import { AppProvider } from '@/contexts/AppContext';

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
  x0Files?: File[];
  supportingFiles?: File[];
}

const PMO: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
  };

  return (
    <AppProvider>
      {selectedProject ? (
        <ProjectDashboard 
          project={selectedProject}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : (
        <EnterpriseDashboard onSelectProject={handleSelectProject} />
      )}
    </AppProvider>
  );
};

export default PMO;