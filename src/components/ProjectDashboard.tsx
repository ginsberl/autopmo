import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, Code, Sparkles, TestTube, Search, ArrowLeft } from 'lucide-react';
import FileUpload from './FileUpload';
import ProjectProposal from './ProjectProposal';
import UserStories from './UserStories';
import CodeSnippets from './CodeSnippets';
import TestAgent from './TestAgent';
import DocumentRetrieval from './DocumentRetrieval';
import { useToast } from '@/hooks/use-toast';

interface ProjectData {
  files: File[];
  x0Files: File[];
  supportingFiles: File[];
  codeSnippets: any[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  x0Files?: File[];
  supportingFiles?: File[];
}

interface ProjectDashboardProps {
  project?: Project;
  onBackToDashboard?: () => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  project,
  onBackToDashboard 
}) => {
  const [projectData, setProjectData] = useState<ProjectData>({
    files: [],
    x0Files: [],
    supportingFiles: [],
    codeSnippets: []
  });
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setProjectData(prev => ({
        ...prev,
        x0Files: project.x0Files || [],
        supportingFiles: project.supportingFiles || []
      }));
    }
  }, [project]);

  const handleX0Upload = (files: File[]) => {
    setProjectData(prev => ({ 
      ...prev, 
      x0Files: [...prev.x0Files, ...files] 
    }));
    toast({ 
      title: "X0 Documents Uploaded", 
      description: `${files.length} X0 document(s) uploaded successfully` 
    });
  };

  const handleSupportingUpload = (files: File[]) => {
    setProjectData(prev => ({ 
      ...prev, 
      supportingFiles: [...prev.supportingFiles, ...files] 
    }));
    toast({ 
      title: "Supporting Documents Uploaded", 
      description: `${files.length} supporting document(s) uploaded successfully` 
    });
  };

  const projectName = project?.name || "IT Project Assistant";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {onBackToDashboard && (
              <Button 
                onClick={onBackToDashboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{projectName}</h1>
              <p className="text-xl text-gray-600">AI-powered project development workflow</p>
              {project?.description && (
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="upload"><FileText className="h-4 w-4 mr-2" />Upload</TabsTrigger>
            <TabsTrigger value="proposal"><Sparkles className="h-4 w-4 mr-2" />X1</TabsTrigger>
            <TabsTrigger value="stories"><Users className="h-4 w-4 mr-2" />Stories</TabsTrigger>
            <TabsTrigger value="code"><Code className="h-4 w-4 mr-2" />Code</TabsTrigger>
            <TabsTrigger value="test"><TestTube className="h-4 w-4 mr-2" />Test</TabsTrigger>
            <TabsTrigger value="docs"><Search className="h-4 w-4 mr-2" />Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload 
              files={projectData.supportingFiles} 
              onFilesChange={handleSupportingUpload}
              title="Upload Project Documentation"
              description="Upload X0 documents (project charter/baseline) and supporting documents for AI analysis."
              allowX0Tag={true}
              onX0Upload={handleX0Upload}
            />
          </TabsContent>

          <TabsContent value="proposal">
            <ProjectProposal 
              proposal={null}
              onDownload={() => toast({ title: "Download started" })}
              onConfigureTemplate={() => {}}
              x0Files={projectData.x0Files}
              projectName={projectName}
            />
          </TabsContent>

          <TabsContent value="stories">
            <UserStories 
              x0Files={projectData.x0Files} 
              supportingFiles={projectData.supportingFiles}
            />
          </TabsContent>

          <TabsContent value="code">
            <CodeSnippets snippets={projectData.codeSnippets} />
          </TabsContent>

          <TabsContent value="test">
            <TestAgent />
          </TabsContent>

          <TabsContent value="docs">
            <DocumentRetrieval 
              documents={[...projectData.files, ...projectData.x0Files, ...projectData.supportingFiles]}
              onDocumentSelect={(doc) => {
                console.log('Selected document:', doc);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDashboard;