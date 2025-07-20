import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Edit3, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AIResponseRating from '@/components/AIResponseRating';

interface X1WorkingCopyProps {
  x0Files: File[];
}

interface SectionData {
  title: string;
  content: string;
  isEditing: boolean;
  aiResponseId?: string;
  showRating?: boolean;
}

const X1WorkingCopy: React.FC<X1WorkingCopyProps> = ({ x0Files }) => {
  const [sections, setSections] = useState<SectionData[]>([
    { title: 'Statement of Business Need', content: '', isEditing: false },
    { title: 'Proposed Project', content: '', isEditing: false },
    { title: 'Strategic Alignment', content: '', isEditing: false },
    { title: 'Portfolio Categorization', content: '', isEditing: false },
    { title: 'Urgency', content: '', isEditing: false },
    { title: 'Must-Have Functional Requirements', content: '', isEditing: false },
    { title: 'Risks', content: '', isEditing: false },
    { title: 'Investments, Benefits, and Return Summary', content: '', isEditing: false },
    { title: 'Resource Level of Effort Estimate', content: '', isEditing: false },
    { title: 'Timeline', content: '', isEditing: false },
    { title: 'SOW (Statement of Work)', content: '', isEditing: false },
    { title: 'Budget Table', content: '', isEditing: false },
    { title: 'Dependencies', content: '', isEditing: false },
    { title: 'Success Criteria', content: '', isEditing: false }
  ]);

  useEffect(() => {
    if (x0Files.length > 0) {
      extractX0Content();
    }
  }, [x0Files]);

  const extractX0Content = async () => {
    if (x0Files.length === 0) return;
    
    let combinedContent = '';
    
    for (const file of x0Files) {
      try {
        const content = await readFileContent(file);
        combinedContent += `\n\n=== ${file.name} ===\n${content}`;
      } catch (error) {
        combinedContent += `\n\n=== ${file.name} ===\n[Error reading file]`;
      }
    }

    setSections(prev => prev.map(section => ({
      ...section,
      content: section.content || `Content from X0 documents for ${section.title}:\n\n${combinedContent.substring(0, 500)}...`
    })));
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        resolve(`[${file.type || 'Unknown'} file - ${file.name}]\n\nContent extracted from ${file.name}`);
      }
    });
  };

  const toggleEdit = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, isEditing: !section.isEditing } : section
    ));
  };

  const updateContent = (index: number, newContent: string) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, content: newContent } : section
    ));
  };

  const askAIAssist = async (index: number) => {
    const section = sections[index];
    const responseId = `ai-response-${Date.now()}-${index}`;
    
    // Simulate AI assistance
    const aiSuggestion = `AI-enhanced content for ${section.title}:\n\nBased on the X0 documents, here are suggested improvements and additional details for this section. This content has been analyzed and enhanced to provide better clarity and completeness.\n\n${section.content}`;
    
    setSections(prev => prev.map((s, i) => 
      i === index ? { 
        ...s, 
        content: aiSuggestion, 
        aiResponseId: responseId,
        showRating: true 
      } : s
    ));
  };

  const handleRatingSubmit = (sectionIndex: number, rating: number, feedback: string) => {
    console.log(`Section ${sectionIndex} rated ${rating}/5:`, feedback);
    // Here you could send the rating to your backend
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>X1 Working Copy</CardTitle>
          <p className="text-sm text-gray-600">
            This is your editable working copy based on the uploaded X0 documents. 
            You can edit each section directly or ask AI to assist with improvements.
          </p>
        </CardHeader>
      </Card>

      {x0Files.length === 0 && (
        <Alert>
          <AlertDescription>
            No X0 documents uploaded. Please upload X0 documents first to populate this working copy.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => askAIAssist(index)}
                    className="flex items-center gap-2"
                  >
                    <Bot className="h-4 w-4" />
                    AI Assist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEdit(index)}
                    className="flex items-center gap-2"
                  >
                    {section.isEditing ? (
                      <><Save className="h-4 w-4" /> Save</>
                    ) : (
                      <><Edit3 className="h-4 w-4" /> Edit</>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.isEditing ? (
                <Textarea
                  value={section.content}
                  onChange={(e) => updateContent(index, e.target.value)}
                  className="min-h-32 w-full"
                  placeholder={`Enter content for ${section.title}...`}
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg min-h-32">
                  {section.content ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {section.content}
                    </pre>
                  ) : (
                    <p className="text-gray-500 italic">
                      No content yet. Click Edit to add content or AI Assist for suggestions.
                    </p>
                  )}
                </div>
              )}
              
              {section.showRating && section.aiResponseId && (
                <AIResponseRating
                  responseId={section.aiResponseId}
                  onRatingSubmit={(rating, feedback) => handleRatingSubmit(index, rating, feedback)}
                  showFeedback={true}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default X1WorkingCopy;