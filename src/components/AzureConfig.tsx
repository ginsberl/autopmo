import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, CheckCircle, TestTube, Loader2, Edit } from 'lucide-react';
import { azureAI } from '@/services/azureAI';
import { useToast } from '@/hooks/use-toast';

interface AzureConfigProps {
  onConfigured: () => void;
}

const AzureConfig: React.FC<AzureConfigProps> = ({ onConfigured }) => {
  const [config, setConfig] = useState({
    endpoint: '',
    apiKey: '',
    deploymentName: ''
  });
  const [isConfigured, setIsConfigured] = useState(azureAI.isConfigured());
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing configuration if available
    if (isConfigured) {
      const existingConfig = azureAI.getConfiguration();
      if (existingConfig) {
        setConfig(existingConfig);
      }
    }
  }, [isConfigured]);

  const handleSave = () => {
    if (!config.endpoint || !config.apiKey || !config.deploymentName) {
      toast({
        title: 'Missing configuration',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    try {
      azureAI.configure(config);
      setIsConfigured(true);
      setIsEditing(false);
      onConfigured();
      toast({
        title: 'Configuration saved',
        description: 'Azure AI is now configured and ready to use.'
      });
    } catch (error) {
      toast({
        title: 'Configuration error',
        description: 'Failed to configure Azure AI.',
        variant: 'destructive'
      });
    }
  };

  const handleTest = async () => {
    if (!azureAI.isConfigured()) {
      toast({
        title: 'Configuration required',
        description: 'Please save your configuration before testing.',
        variant: 'destructive'
      });
      return;
    }

    setIsTesting(true);
    try {
      const result = await azureAI.testConfiguration();
      
      if (result.success) {
        toast({
          title: 'Test successful!',
          description: result.message
        });
      } else {
        toast({
          title: 'Test failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Test error',
        description: 'An unexpected error occurred during testing.',
        variant: 'destructive'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const showForm = !isConfigured || isEditing;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConfigured && !isEditing ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Settings className="h-5 w-5" />
            )}
            {isConfigured && !isEditing ? 'Azure AI Configured' : 'Configure Azure AI'}
          </div>
          {isConfigured && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showForm && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Azure AI is configured and ready to generate content.
              </p>
              <div className="text-sm space-y-1">
                <div><strong>Endpoint:</strong> {config.endpoint}</div>
                <div><strong>Deployment:</strong> {config.deploymentName}</div>
                <div><strong>API Key:</strong> {'*'.repeat(config.apiKey.length)}</div>
              </div>
            </div>
          </>
        )}
        
        {showForm && (
          <>
            <Alert>
              <AlertDescription>
                Configure your Azure OpenAI credentials to enable AI-powered content generation.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="endpoint">Azure OpenAI Endpoint</Label>
                <Input
                  id="endpoint"
                  placeholder="https://your-resource.openai.azure.com"
                  value={config.endpoint}
                  onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your Azure OpenAI API key"
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="deploymentName">Deployment Name</Label>
                <Input
                  id="deploymentName"
                  placeholder="gpt-4"
                  value={config.deploymentName}
                  onChange={(e) => setConfig(prev => ({ ...prev, deploymentName: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  Save Configuration
                </Button>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to saved config
                      const existingConfig = azureAI.getConfiguration();
                      if (existingConfig) {
                        setConfig(existingConfig);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
        
        {azureAI.isConfigured() && (
          <Button 
            onClick={handleTest} 
            disabled={isTesting}
            variant="outline"
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Configuration...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Test Configuration
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AzureConfig;