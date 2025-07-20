import React, { useCallback, useState } from 'react';
import { Upload, File, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
  description?: string;
  allowX0Tag?: boolean;
  onX0Upload?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  files, 
  onFilesChange, 
  title = "Drop files here or click to upload",
  description = "Support for PDF, DOC, TXT, and more",
  allowX0Tag = false,
  onX0Upload
}) => {
  const [isX0Upload, setIsX0Upload] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (isX0Upload && onX0Upload) {
      onX0Upload(droppedFiles);
    } else {
      onFilesChange([...files, ...droppedFiles]);
    }
  }, [files, onFilesChange, isX0Upload, onX0Upload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (isX0Upload && onX0Upload) {
        onX0Upload(selectedFiles);
      } else {
        onFilesChange([...files, ...selectedFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      {allowX0Tag && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
          <Checkbox 
            id="x0-tag" 
            checked={isX0Upload}
            onCheckedChange={(checked) => setIsX0Upload(checked as boolean)}
          />
          <Label htmlFor="x0-tag" className="flex items-center gap-2 cursor-pointer">
            <Tag className="h-4 w-4 text-blue-600" />
            Tag as X0 Document (Project Charter)
          </Label>
        </div>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isX0Upload ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className={`mx-auto h-12 w-12 mb-4 ${
          isX0Upload ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <p className="text-lg font-medium mb-2">
          {isX0Upload ? 'Upload X0 Document (Project Charter)' : title}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {isX0Upload ? 'This will be tagged as an X0 document for the X1 section' : description}
        </p>
        <input
          type="file"
          multiple={!isX0Upload}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.txt,.md,.json,.xml"
        />
        <Button asChild variant={isX0Upload ? 'default' : 'outline'}>
          <label htmlFor="file-upload" className="cursor-pointer">
            {isX0Upload ? 'Upload X0 Document' : 'Select Files'}
          </label>
        </Button>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Uploaded Files:</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default FileUpload;