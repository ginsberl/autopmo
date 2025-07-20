import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Settings, Calendar, User, CheckCircle, Circle, Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateProjectDialog from './CreateProjectDialog';

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

const EnterpriseDashboard: React.FC<{ onSelectProject: (project: Project) => void }> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const loadedProjects = JSON.parse(savedProjects).map((p: any) => ({
        ...p,
        x0Status: p.x0Status || 'none',
        x1Status: p.x1Status || 'pending',
        userStoriesStatus: p.userStoriesStatus || 'pending',
        codeStatus: p.codeStatus || 'pending',
        testingStatus: p.testingStatus || 'pending',
        owner: p.owner || 'Unassigned'
      }));
      setProjects(loadedProjects);
    }
  }, []);

  const handleCreateProject = (name: string, description: string, x0Files?: File[], supportingFiles?: File[]) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      status: 'draft',
      owner: 'Unassigned',
      x0Status: 'none',
      x1Status: 'pending',
      userStoriesStatus: 'pending',
      codeStatus: 'pending',
      testingStatus: 'pending',
      x0Files: x0Files || [],
      supportingFiles: supportingFiles || []
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    onSelectProject(newProject);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'active').length;
  const blockedProjects = projects.filter(p => p.status === 'blocked').length;
  const completionRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'in-progress') return <Clock className="w-4 h-4 text-blue-600" />;
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-red-800 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-lg font-bold">apei</span>
              <div className="text-xs">
                <div className="font-semibold">AMERICAN PUBLIC</div>
                <div className="font-semibold">EDUCATION, INC.</div>
              </div>
            </div>
            <div className="ml-8">
              <h1 className="text-3xl font-bold text-gray-900">PMO Enterprise Dashboard</h1>
              <p className="text-gray-600 mt-2">Track project progress through X0 to X1 process</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <Settings className="w-4 h-4 mr-2" />Admin
            </Button>
            <CreateProjectDialog onCreateProject={handleCreateProject} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{blockedProjects}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">Use the search filters above or create a new project</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage and track all enterprise projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      className="cursor-pointer hover:bg-gray-50" 
                      onClick={() => onSelectProject(project)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {project.owner}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            {getStageIcon(project.x0Status === 'uploaded' ? 'completed' : 'pending')}
                            <span className="text-xs">X0</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStageIcon(project.x1Status)}
                            <span className="text-xs">X1</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStageIcon(project.userStoriesStatus)}
                            <span className="text-xs">Stories</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStageIcon(project.codeStatus)}
                            <span className="text-xs">Code</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStageIcon(project.testingStatus)}
                            <span className="text-xs">Test</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnterpriseDashboard;