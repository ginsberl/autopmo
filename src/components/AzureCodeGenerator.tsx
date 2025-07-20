import React from 'react';
import { Button } from '@/components/ui/button';
import { azureAI } from '@/services/azureAI';
import { useToast } from '@/hooks/use-toast';
import AIResponseRating from '@/components/AIResponseRating';

interface AzureCodeGeneratorProps {
  story: any;
  onCodeGenerated: (code: any) => void;
}

const AzureCodeGenerator: React.FC<AzureCodeGeneratorProps> = ({ story, onCodeGenerated }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedCode, setGeneratedCode] = React.useState<any>(null);
  const [showRating, setShowRating] = React.useState(false);

  const generateCode = async () => {
    if (!azureAI.isConfigured()) {
      toast({
        title: 'Azure AI not configured',
        description: 'Please configure Azure AI first.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Mock Azure AI code generation
      const mockCode = {
        id: Date.now().toString(),
        storyId: story.id,
        title: `${story.title} Component`,
        language: 'tsx',
        code: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ${story.title.replace(/\s+/g, '')}Component = () => {
  const [data, setData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ${story.description}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Enter data"
      />
      <Button type="submit">${story.title}</Button>
    </form>
  );
};

export default ${story.title.replace(/\s+/g, '')}Component;`,
        description: `Generated component for: ${story.description}`
      };
      
      setGeneratedCode(mockCode);
      setShowRating(true);
      onCodeGenerated(mockCode);
      toast({
        title: 'Code generated!',
        description: 'Code snippet created using Azure AI.'
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'Failed to generate code.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    console.log(`Code generation rated ${rating}/5:`, feedback);
    // Here you could send the rating to your backend
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={generateCode} 
        disabled={isGenerating}
        size="sm"
        variant="outline"
      >
        {isGenerating ? 'Generating...' : 'Generate Code'}
      </Button>
      
      {showRating && generatedCode && (
        <AIResponseRating
          responseId={`code-gen-${generatedCode.id}`}
          onRatingSubmit={handleRatingSubmit}
          showFeedback={true}
        />
      )}
    </div>
  );
};

export default AzureCodeGenerator;