import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Download, Wand2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  generatedBy: 'ai' | 'manual';
}

interface CodeSnippetsProps {
  snippets: CodeSnippet[];
}

const CodeSnippets: React.FC<CodeSnippetsProps> = ({ snippets: initialSnippets }) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(initialSnippets || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCodeWithAI = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const aiGeneratedSnippets: CodeSnippet[] = [
        {
          id: '1',
          title: 'User Authentication Component',
          language: 'tsx',
          description: 'React component for user login with form validation',
          generatedBy: 'ai',
          code: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;`
        },
        {
          id: '2',
          title: 'API Service',
          language: 'ts',
          description: 'Service for handling API requests',
          generatedBy: 'ai',
          code: `class ApiService {
  private baseUrl = '/api';

  async get(endpoint: string) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const apiService = new ApiService();`
        }
      ];
      
      setSnippets(prev => [...prev, ...aiGeneratedSnippets]);
      setIsGenerating(false);
      toast({
        title: "Code generated!",
        description: "AI has created code snippets for your project."
      });
    }, 2000);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied."
    });
  };

  const downloadSnippet = (snippet: CodeSnippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.toLowerCase().replace(/\s+/g, '-')}.${snippet.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (snippets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Code className="h-6 w-6" />
            AI Code Generator
          </h2>
          <Button onClick={generateCodeWithAI} disabled={isGenerating}>
            <Wand2 className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Code with AI'}
          </Button>
        </div>
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <Code className="mx-auto h-12 w-12 mb-4" />
            <p>No code snippets generated yet</p>
            <p className="text-sm">Use AI to generate code snippets for your project</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6" />
          Generated Code ({snippets.length})
        </h2>
        <Button onClick={generateCodeWithAI} disabled={isGenerating}>
          <Wand2 className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate More Code'}
        </Button>
      </div>
      
      <div className="grid gap-4">
        {snippets.map((snippet) => (
          <Card key={snippet.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{snippet.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={snippet.generatedBy === 'ai' ? 'default' : 'secondary'}>
                    {snippet.generatedBy === 'ai' ? 'AI Generated' : 'Manual'}
                  </Badge>
                  <Badge variant="outline">{snippet.language}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(snippet.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadSnippet(snippet)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{snippet.code}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CodeSnippets;