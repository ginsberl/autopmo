import React, { useState } from 'react';
import EnterpriseDashboard from './EnterpriseDashboard';
import ProjectDashboard from './ProjectDashboard';

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

const AppLayout: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <ProjectDashboard 
        projectName={selectedProject.name}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return <EnterpriseDashboard onSelectProject={handleSelectProject} />;
};

export default AppLayout;