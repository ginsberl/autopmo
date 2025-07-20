import { toast } from '@/hooks/use-toast';

interface AzureAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  content: string;
  relevanceScore?: number;
  tags: string[];
}

class AzureAIService {
  private config: AzureAIConfig | null = null;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 10000; // 10 seconds

  configure(config: AzureAIConfig) {
    this.config = config;
    localStorage.setItem('azureAIConfig', JSON.stringify(config));
  }

  isConfigured(): boolean {
    if (this.config) return true;
    
    const stored = localStorage.getItem('azureAIConfig');
    if (stored) {
      try {
        this.config = JSON.parse(stored);
        return true;
      } catch {
        localStorage.removeItem('azureAIConfig');
      }
    }
    return false;
  }

  getConfiguration(): AzureAIConfig | null {
    if (this.config) return { ...this.config };
    
    const stored = localStorage.getItem('azureAIConfig');
    if (stored) {
      try {
        this.config = JSON.parse(stored);
        return { ...this.config };
      } catch {
        localStorage.removeItem('azureAIConfig');
      }
    }
    return null;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
        await this.delay(this.MIN_REQUEST_INTERVAL - timeSinceLastRequest);
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queued request failed:', error);
        }
        this.lastRequestTime = Date.now();
      }
    }
    
    this.isProcessingQueue = false;
  }

  private async makeAIRequestWithRetry(messages: any[], maxTokens = 2000, retries = 0): Promise<string> {
    try {
      return await this.makeAIRequest(messages, maxTokens);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Rate limit') && retries < this.MAX_RETRIES) {
        toast({
          title: "Rate Limit - Retrying",
          description: `Waiting ${this.RETRY_DELAY/1000}s before retry ${retries + 1}/${this.MAX_RETRIES}`,
          variant: "default"
        });
        await this.delay(this.RETRY_DELAY * (retries + 1));
        return this.makeAIRequestWithRetry(messages, maxTokens, retries + 1);
      }
      throw error;
    }
  }

  private async makeAIRequest(messages: any[], maxTokens = 2000): Promise<string> {
    if (!this.isConfigured() || !this.config) {
      throw new Error('Azure AI not configured');
    }

    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        try {
          const response = await fetch(`${this.config!.endpoint}/openai/deployments/${this.config!.deploymentName}/chat/completions?api-version=2024-02-15-preview`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': this.config!.apiKey
            },
            body: JSON.stringify({
              messages,
              max_tokens: maxTokens,
              temperature: 0.7
            })
          });

          if (response.status === 429) {
            const errorData = await response.json().catch(() => ({}));
            const retryAfter = response.headers.get('Retry-After');
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : this.RETRY_DELAY;
            
            toast({
              title: "Rate Limit Exceeded",
              description: `Please wait ${waitTime/1000} seconds before trying again.`,
              variant: "destructive"
            });
            
            reject(new Error('Rate limit exceeded. Please wait and try again.'));
            return;
          }

          if (!response.ok) {
            const errorText = await response.text();
            reject(new Error(`Azure AI API error: ${response.status} - ${errorText}`));
            return;
          }

          const data = await response.json();
          resolve(data.choices?.[0]?.message?.content || '');
        } catch (error) {
          if (error instanceof Error && (error.message.includes('429') || error.message.includes('Rate limit'))) {
            toast({
              title: "Rate Limit Exceeded",
              description: "Too many requests. Please wait before trying again.",
              variant: "destructive"
            });
          }
          reject(error);
        }
      };

      this.requestQueue.push(executeRequest);
      this.processQueue();
    });
  }

  private cleanJsonResponse(content: string): string {
    content = content.replace(/```json\s*|```\s*/g, '');
    content = content.trim();
    const firstBrace = Math.max(content.indexOf('{'), content.indexOf('['));
    const lastBrace = Math.max(content.lastIndexOf('}'), content.lastIndexOf(']'));
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      content = content.substring(firstBrace, lastBrace + 1);
    }
    
    return content;
  }

  async testConfiguration(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured() || !this.config) {
      return { success: false, message: 'Azure AI not configured' };
    }

    try {
      const content = await this.makeAIRequestWithRetry([
        {
          role: 'user',
          content: 'Hello, this is a test message. Please respond with "Configuration test successful!"'
        }
      ], 50);
      
      return {
        success: true,
        message: `Test successful! AI responded: "${content}"`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateProposal(files: File[], template?: string): Promise<any> {
    try {
      const fileContents = await this.extractFileContents(files);
      
      const systemPrompt = template 
        ? `You are an expert IT project manager. Generate a project proposal based on the provided documentation and format it according to this template: ${template}. Replace placeholders like {{title}}, {{description}}, etc. with actual content.`
        : 'You are an expert IT project manager. Generate a comprehensive project proposal based on the provided documentation.';
      
      const content = await this.makeAIRequestWithRetry([
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate a project proposal from this documentation: ${fileContents}`
        }
      ]);

      return this.parseProposalResponse(content, template);
    } catch (error) {
      console.error('Azure AI Error:', error);
      throw error;
    }
  }

  async generateUserStories(proposal: any): Promise<any[]> {
    try {
      const content = await this.makeAIRequestWithRetry([
        {
          role: 'system',
          content: 'Generate user stories from project proposal. Return ONLY a valid JSON array with objects containing: id, title, description, acceptanceCriteria, priority, storyPoints. Do not include any markdown formatting or extra text.'
        },
        {
          role: 'user',
          content: `Generate user stories for: ${JSON.stringify(proposal)}`
        }
      ]);

      const cleanedContent = this.cleanJsonResponse(content);
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Azure AI Error:', error);
      throw error;
    }
  }

  async generateTestCases(userStories: any[], documents: File[]): Promise<TestCase[]> {
    try {
      const fileContents = await this.extractFileContents(documents);
      
      const content = await this.makeAIRequestWithRetry([
        {
          role: 'system',
          content: 'Generate comprehensive test cases from user stories and documentation. Return ONLY a valid JSON array with objects containing: id, name, description, status (always "pending"). Do not include any markdown formatting or extra text.'
        },
        {
          role: 'user',
          content: `Generate test cases for these user stories: ${JSON.stringify(userStories)} and documentation: ${fileContents}`
        }
      ]);

      const cleanedContent = this.cleanJsonResponse(content);
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Azure AI Error:', error);
      throw error;
    }
  }

  async searchDocuments(query: string, documents: File[]): Promise<DocumentItem[]> {
    try {
      const fileContents = await this.extractFileContents(documents);
      
      const content = await this.makeAIRequestWithRetry([
        {
          role: 'system',
          content: 'Analyze documents and return relevant matches for the search query. Return ONLY a valid JSON array with objects containing: id, name, type, size, lastModified, content (excerpt), relevanceScore (0-100), tags. Do not include any markdown formatting or extra text.'
        },
        {
          role: 'user',
          content: `Search for "${query}" in these documents: ${fileContents}`
        }
      ], 2000);

      const cleanedContent = this.cleanJsonResponse(content);
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Azure AI Error:', error);
      throw error;
    }
  }

  private async extractFileContents(files: File[]): Promise<string> {
    const contents = await Promise.all(
      files.map(file => file.text())
    );
    return contents.join('\n\n');
  }

  private parseProposalResponse(content: string, template?: string): any {
    if (template) {
      const extractValue = (pattern: string) => {
        const match = content.match(new RegExp(pattern + ':\\s*(.+)', 'i'));
        return match ? match[1].trim() : '';
      };

      return {
        title: extractValue('title') || 'AI Generated Project',
        description: extractValue('description') || content.substring(0, 200),
        scope: extractValue('scope')?.split(',').map(s => s.trim()) || ['Feature 1', 'Feature 2'],
        timeline: extractValue('timeline') || '8-12 weeks',
        budget: extractValue('budget') || '$50,000 - $75,000',
        deliverables: extractValue('deliverables')?.split(',').map(s => s.trim()) || ['Web Application', 'Documentation'],
        risks: extractValue('risks')?.split(',').map(s => s.trim()) || ['Technical complexity', 'Timeline constraints']
      };
    }

    return {
      title: 'AI Generated Project',
      description: content.substring(0, 200),
      scope: ['Feature 1', 'Feature 2'],
      timeline: '8-12 weeks',
      budget: '$50,000 - $75,000',
      deliverables: ['Web Application', 'Documentation'],
      risks: ['Technical complexity', 'Timeline constraints']
    };
  }
}

export const azureAI = new AzureAIService();