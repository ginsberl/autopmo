import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload } from 'lucide-react';
import X0DocumentViewer from './X0DocumentViewer';
import X1MilestoneTemplate from './X1MilestoneTemplate';

interface ProjectProposalProps {
  proposal: {
    title: string;
    description: string;
    scope: string[];
    timeline: string;
    budget: string;
    deliverables: string[];
    risks: string[];
  } | null;
  onDownload: () => void;
  onConfigureTemplate: () => void;
  template?: string;
  x0Files: File[];
  projectName?: string;
}

const ProjectProposal: React.FC<ProjectProposalProps> = ({ 
  x0Files,
  projectName = "Project Title Here"
}) => {
  const [projectTitle, setProjectTitle] = useState(projectName);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            X1 Milestone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="x0-upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="x0-upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                X0 Upload
              </TabsTrigger>
              <TabsTrigger value="x1-working" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                X1 Working Copy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="x0-upload" className="mt-6">
              <X0DocumentViewer x0Files={x0Files} />
            </TabsContent>
            
            <TabsContent value="x1-working" className="mt-6">
              <X1MilestoneTemplate 
                projectTitle={projectTitle}
                onProjectTitleChange={setProjectTitle}
                x0Files={x0Files}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectProposal;