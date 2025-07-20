import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, Clock, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AIResponseRating from '@/components/AIResponseRating';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
  generatedCode?: string;
  aiResponseId?: string;
  showRating?: boolean;
}

const TestAgent: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [customTest, setCustomTest] = useState('');
  const [testName, setTestName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerationRating, setShowGenerationRating] = useState(false);
  const [generationResponseId, setGenerationResponseId] = useState('');
  const { toast } = useToast();

  const generateTestCases = async () => {
    setIsGenerating(true);
    const responseId = `test-gen-${Date.now()}`;
    setGenerationResponseId(responseId);
    
    // Simulate AI test generation
    setTimeout(() => {
      const aiGeneratedTests: TestCase[] = [
        {
          id: '1',
          name: 'User Authentication Test',
          description: 'Verify user can successfully log in with valid credentials and receive proper authentication tokens',
          status: 'pending',
          generatedCode: `describe('User Authentication', () => {\n  test('should login with valid credentials', async () => {\n    const result = await login('user@example.com', 'password123');\n    expect(result.success).toBe(true);\n    expect(result.token).toBeDefined();\n  });\n});`,
          aiResponseId: `test-case-${Date.now()}-1`,
          showRating: true
        },
        {
          id: '2',
          name: 'Dashboard Load Test',
          description: 'Verify dashboard loads correctly with user data and displays all required components',
          status: 'pending',
          generatedCode: `describe('Dashboard', () => {\n  test('should load user dashboard', async () => {\n    render(<Dashboard userId="123" />);\n    expect(screen.getByText('Welcome')).toBeInTheDocument();\n    expect(screen.getByRole('navigation')).toBeInTheDocument();\n  });\n});`,
          aiResponseId: `test-case-${Date.now()}-2`,
          showRating: true
        },
        {
          id: '3',
          name: 'Data Validation Test',
          description: 'Test form validation for required fields and data format requirements',
          status: 'pending',
          generatedCode: `describe('Form Validation', () => {\n  test('should validate required fields', () => {\n    const errors = validateForm({ email: '', password: '' });\n    expect(errors.email).toBe('Email is required');\n    expect(errors.password).toBe('Password is required');\n  });\n});`,
          aiResponseId: `test-case-${Date.now()}-3`,
          showRating: true
        }
      ];
      
      setTestCases(aiGeneratedTests);
      setIsGenerating(false);
      setShowGenerationRating(true);
      toast({
        title: "Test cases generated!",
        description: "AI has created comprehensive test cases with code examples."
      });
    }, 2000);
  };

  const runTest = async (testId: string) => {
    setTestCases(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ));

    // Simulate test execution with AI analysis
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const results = {
        passed: [
          'All assertions passed successfully',
          'Test completed within expected timeframe',
          'No memory leaks detected',
          'Performance metrics within acceptable range'
        ],
        failed: [
          'Assertion failed: Expected true but got false',
          'Timeout: Test exceeded 5000ms limit',
          'Network error: Unable to connect to test server',
          'Validation error: Invalid data format detected'
        ]
      };
      
      const resultMessages = success ? results.passed : results.failed;
      const randomResult = resultMessages[Math.floor(Math.random() * resultMessages.length)];
      
      setTestCases(prev => prev.map(test => 
        test.id === testId ? { 
          ...test, 
          status: success ? 'passed' : 'failed',
          result: randomResult
        } : test
      ));
    }, 3000);
  };

  const addCustomTest = () => {
    if (!testName.trim() || !customTest.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both test name and description.",
        variant: "destructive"
      });
      return;
    }

    const newTest: TestCase = {
      id: Date.now().toString(),
      name: testName,
      description: customTest,
      status: 'pending'
    };

    setTestCases(prev => [...prev, newTest]);
    setTestName('');
    setCustomTest('');
    toast({
      title: "Test case added!",
      description: "Custom test case has been added to the suite."
    });
  };

  const runAllTests = () => {
    testCases.forEach((test, index) => {
      setTimeout(() => {
        runTest(test.id);
      }, index * 1000);
    });
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestCase['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      passed: 'default',
      failed: 'destructive'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleRatingSubmit = (responseId: string, rating: number, feedback: string) => {
    console.log(`AI response ${responseId} rated ${rating}/5:`, feedback);
    // Here you could send the rating to your backend
  };

  const passedTests = testCases.filter(t => t.status === 'passed').length;
  const failedTests = testCases.filter(t => t.status === 'failed').length;
  const runningTests = testCases.filter(t => t.status === 'running').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            AI Test Agent
          </CardTitle>
          <CardDescription>
            Generate comprehensive test cases using AI and execute automated testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={generateTestCases} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "Generating with AI..." : "Generate Test Cases with AI"}
            </Button>
            
            {testCases.length > 0 && (
              <Button 
                onClick={runAllTests}
                variant="outline"
                disabled={runningTests > 0}
              >
                Run All Tests
              </Button>
            )}
          </div>
          
          {showGenerationRating && generationResponseId && (
            <AIResponseRating
              responseId={generationResponseId}
              onRatingSubmit={(rating, feedback) => handleRatingSubmit(generationResponseId, rating, feedback)}
              showFeedback={true}
            />
          )}
          
          {testCases.length > 0 && (
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <span className="font-semibold">Total:</span> {testCases.length}
              </div>
              <div className="text-sm text-green-600">
                <span className="font-semibold">Passed:</span> {passedTests}
              </div>
              <div className="text-sm text-red-600">
                <span className="font-semibold">Failed:</span> {failedTests}
              </div>
              <div className="text-sm text-blue-600">
                <span className="font-semibold">Running:</span> {runningTests}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="testName">Custom Test Name</Label>
              <Input
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Enter test case name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customTest">Test Description</Label>
              <Textarea
                id="customTest"
                value={customTest}
                onChange={(e) => setCustomTest(e.target.value)}
                placeholder="Describe what this test should verify..."
                rows={3}
              />
            </div>
          </div>
          
          <Button onClick={addCustomTest} variant="outline" className="w-full">
            Add Custom Test Case
          </Button>
        </CardContent>
      </Card>

      {testCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Suite ({testCases.length} tests)</CardTitle>
            <CardDescription>
              AI-generated and custom test cases with execution results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testCases.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <h3 className="font-semibold">{test.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.status)}
                      <Button
                        size="sm"
                        onClick={() => runTest(test.id)}
                        disabled={test.status === 'running'}
                      >
                        {test.status === 'running' ? 'Running...' : 'Run Test'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{test.description}</p>
                  
                  {test.generatedCode && (
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <h4 className="font-semibold mb-2">Generated Test Code:</h4>
                      <pre className="overflow-x-auto">
                        <code>{test.generatedCode}</code>
                      </pre>
                    </div>
                  )}
                  
                  {test.result && (
                    <div className={`text-sm p-3 rounded ${
                      test.status === 'passed' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <strong>Result:</strong> {test.result}
                    </div>
                  )}
                  
                  {test.showRating && test.aiResponseId && (
                    <AIResponseRating
                      responseId={test.aiResponseId}
                      onRatingSubmit={(rating, feedback) => handleRatingSubmit(test.aiResponseId!, rating, feedback)}
                      showFeedback={true}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestAgent;