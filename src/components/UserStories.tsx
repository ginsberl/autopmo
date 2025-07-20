import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Wand2, Code, TestTube, FileText, Brain } from 'lucide-react';

interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  acceptanceCriteria: string[];
  generatedCode?: string;
  testCases?: string[];
  sourceDocuments?: string[];
}

interface UserStoriesProps {
  x0Files: File[];
  supportingFiles: File[];
}

const UserStories: React.FC<UserStoriesProps> = ({ x0Files, supportingFiles }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    storyPoints: 3
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const generateUserStories = async () => {
    if (x0Files.length === 0 && supportingFiles.length === 0) {
      alert('Please upload X0 or supporting documents first');
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation using both X0 and supporting documents
    setTimeout(() => {
      const aiGeneratedStories: UserStory[] = [
        {
          id: '1',
          title: 'User Authentication System',
          description: 'As a user, I want to securely log in to the system so that I can access my personalized dashboard.',
          priority: 'High',
          storyPoints: 8,
          acceptanceCriteria: [
            'User can log in with email and password',
            'System validates credentials securely',
            'Failed login attempts are logged',
            'User is redirected to dashboard on success'
          ],
          sourceDocuments: ['X0 Charter', 'Security Requirements Doc']
        },
        {
          id: '2',
          title: 'Project Dashboard',
          description: 'As a project manager, I want to view all my projects in a dashboard so that I can track progress.',
          priority: 'High',
          storyPoints: 5,
          acceptanceCriteria: [
            'Display list of all projects',
            'Show project status and progress',
            'Allow filtering by status',
            'Provide quick actions for each project'
          ],
          sourceDocuments: ['X0 Charter', 'UI Specifications']
        },
        {
          id: '3',
          title: 'Document Analysis Integration',
          description: 'As a system, I want to analyze multiple document types to extract comprehensive requirements.',
          priority: 'Medium',
          storyPoints: 13,
          acceptanceCriteria: [
            'Process X0 baseline documents',
            'Analyze supporting documentation',
            'Extract and correlate requirements',
            'Generate unified user story backlog'
          ],
          sourceDocuments: ['Technical Specifications', 'Business Requirements']
        }
      ];
      setStories(aiGeneratedStories);
      setIsGenerating(false);
    }, 2000);
  };

  const addManualStory = () => {
    if (!newStory.title || !newStory.description) return;
    
    const story: UserStory = {
      id: Date.now().toString(),
      ...newStory,
      acceptanceCriteria: []
    };
    
    setStories([...stories, story]);
    setNewStory({ title: '', description: '', priority: 'Medium', storyPoints: 3 });
    setShowAddForm(false);
  };

  const generateCode = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    setTimeout(() => {
      const generatedCode = `// Generated code for: ${story.title}\n\nfunction ${story.title.replace(/\s+/g, '')}() {\n  // Implementation here\n  console.log('${story.description}');\n}`;
      
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, generatedCode } : s
      ));
    }, 1500);
  };

  const generateTests = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    setTimeout(() => {
      const testCases = [
        `Test: ${story.title} - Happy Path`,
        `Test: ${story.title} - Error Handling`,
        `Test: ${story.title} - Edge Cases`
      ];
      
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, testCases } : s
      ));
    }, 1500);
  };

  const totalDocuments = x0Files.length + supportingFiles.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Stories</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generated from {x0Files.length} X0 document(s) and {supportingFiles.length} supporting document(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Manual Story
          </Button>
          <Button onClick={generateUserStories} disabled={isGenerating || totalDocuments === 0}>
            <Brain className="h-4 w-4 mr-2" />
            {isGenerating ? 'Analyzing Documents...' : 'Generate with AI'}
          </Button>
        </div>
      </div>

      {totalDocuments > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Document Analysis Ready</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              AI will analyze all uploaded documents to create comprehensive user stories that capture requirements from both X0 baseline and supporting materials.
            </p>
          </CardContent>
        </Card>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newStory.title}
                onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                placeholder="Enter story title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newStory.description}
                onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                placeholder="As a user, I want..."
              />
            </div>
            <div className="flex gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={newStory.priority}
                  onChange={(e) => setNewStory({...newStory, priority: e.target.value as any})}
                  className="w-full p-2 border rounded"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <Label htmlFor="points">Story Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={newStory.storyPoints}
                  onChange={(e) => setNewStory({...newStory, storyPoints: parseInt(e.target.value)})}
                  min="1"
                  max="21"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addManualStory}>Add Story</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {totalDocuments === 0 
                ? 'Upload X0 and supporting documents, then generate user stories with AI.' 
                : 'No user stories yet. Generate stories with AI or add them manually.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <Card key={story.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={story.priority === 'High' ? 'destructive' : story.priority === 'Medium' ? 'default' : 'secondary'}>
                      {story.priority}
                    </Badge>
                    <Badge variant="outline">{story.storyPoints} pts</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{story.description}</p>
                
                {story.sourceDocuments && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Source Documents:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {story.sourceDocuments.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {story.acceptanceCriteria.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Acceptance Criteria:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {story.acceptanceCriteria.map((criteria, index) => (
                        <li key={index} className="text-sm text-gray-600">{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {story.generatedCode && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Generated Code:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{story.generatedCode}</code>
                    </pre>
                  </div>
                )}
                
                {story.testCases && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Test Cases:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {story.testCases.map((test, index) => (
                        <li key={index} className="text-sm text-gray-600">{test}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => generateCode(story.id)} disabled={!!story.generatedCode}>
                    <Code className="h-4 w-4 mr-2" />
                    {story.generatedCode ? 'Code Generated' : 'Generate Code'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateTests(story.id)} disabled={!!story.testCases}>
                    <TestTube className="h-4 w-4 mr-2" />
                    {story.testCases ? 'Tests Generated' : 'Generate Tests'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStories;