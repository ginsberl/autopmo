import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Save, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProposalTemplateProps {
  onTemplateUpdate: (template: string) => void;
  currentTemplate?: string;
}

const defaultTemplate = `# Project Proposal: {{title}}

## Executive Summary
{{description}}

## Project Scope
{{scope}}

## Timeline
{{timeline}}

## Budget
{{budget}}

## Deliverables
{{deliverables}}

## Risk Assessment
{{risks}}

## Conclusion
This proposal outlines the key aspects of the {{title}} project and provides a roadmap for successful implementation.`;

const ProposalTemplate: React.FC<ProposalTemplateProps> = ({ onTemplateUpdate, currentTemplate }) => {
  const [template, setTemplate] = useState(currentTemplate || defaultTemplate);
  const { toast } = useToast();

  const handleSave = () => {
    onTemplateUpdate(template);
    toast({
      title: "Template Saved",
      description: "Your proposal template has been updated successfully.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTemplate(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Proposal Template Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="template">Template Format</Label>
          <p className="text-sm text-gray-600 mb-2">
            Use placeholders like {{title}}, {{description}}, {{scope}}, {{timeline}}, {{budget}}, {{deliverables}}, {{risks}}
          </p>
          <Textarea
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={15}
            className="font-mono text-sm"
            placeholder="Enter your proposal template..."
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Template
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalTemplate;