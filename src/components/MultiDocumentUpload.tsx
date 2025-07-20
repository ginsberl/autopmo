import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Tag, Brain } from 'lucide-react';
import FileUpload from './FileUpload';

interface MultiDocumentUploadProps {
  onDocumentsUploaded: (x0Files: File[], supportingFiles: File[]) => void;
}

const MultiDocumentUpload: React.FC<MultiDocumentUploadProps> = ({ onDocumentsUploaded }) => {
  const [x0Files, setX0Files] = useState<File[]>([]);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const handleX0Upload = (files: File[]) => {
    setX0Files(files);
  };

  const handleSupportingUpload = (files: File[]) => {
    setSupportingFiles(files);
  };

  const handleSubmit = () => {
    onDocumentsUploaded(x0Files, supportingFiles);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Project Documents Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="x0" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="x0" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              X0 Document
              {x0Files.length > 0 && <Badge variant="secondary">{x0Files.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="supporting" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Supporting Documents
              {supportingFiles.length > 0 && <Badge variant="secondary">{supportingFiles.length}</Badge>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="x0" className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">X0 Document (Project Charter)</h3>
              <p className="text-sm text-blue-700">
                Upload the baseline X0 document that will be used to evolve into the X1 milestone template.
              </p>
            </div>
            <FileUpload
              files={x0Files}
              onFilesChange={setX0Files}
              title="Upload X0 Document"
              description="Project charter or baseline document"
            />
          </TabsContent>
          
          <TabsContent value="supporting" className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 mb-2">Supporting Documents for AI Analysis</h3>
                  <p className="text-sm text-green-700">
                    Upload additional documents that will be analyzed by AI to create comprehensive user stories.
                    These documents complement the X0 baseline.
                  </p>
                </div>
              </div>
            </div>
            <FileUpload
              files={supportingFiles}
              onFilesChange={setSupportingFiles}
              title="Upload Supporting Documents"
              description="Requirements, specifications, research docs, etc."
            />
          </TabsContent>
        </Tabs>
        
        {(x0Files.length > 0 || supportingFiles.length > 0) && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                X0 Files: {x0Files.length} | Supporting Files: {supportingFiles.length}
              </div>
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Process Documents with AI
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiDocumentUpload;