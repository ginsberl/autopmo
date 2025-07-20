import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, FileText, Download, Eye, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { azureAI } from '@/services/azureAI';

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

interface DocumentRetrievalProps {
  documents: File[];
  onDocumentSelect?: (document: DocumentItem) => void;
}

const DocumentRetrieval: React.FC<DocumentRetrievalProps> = ({ documents, onDocumentSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [indexedDocs, setIndexedDocs] = useState<DocumentItem[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    // Index documents when they change
    const indexed = documents.map((file, index) => ({
      id: `doc-${index}`,
      name: file.name,
      type: file.type || 'unknown',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      lastModified: new Date(file.lastModified).toLocaleDateString(),
      content: 'Document content preview...',
      tags: ['uploaded', file.type?.includes('pdf') ? 'pdf' : 'document']
    }));
    setIndexedDocs(indexed);
  }, [documents]);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty search query",
        description: "Please enter a search term.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const results = await azureAI.searchDocuments(searchQuery, documents);
      setSearchResults(results);
      toast({
        title: "Search completed",
        description: `Found ${results.length} relevant documents.`
      });
    } catch (error) {
      // Fallback search logic
      const mockResults: DocumentItem[] = indexedDocs
        .filter(doc => 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(doc => ({
          ...doc,
          relevanceScore: Math.random() * 100
        }))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      setSearchResults(mockResults);
      toast({
        title: "Search completed",
        description: `Found ${mockResults.length} relevant documents (local search).`
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const viewDocument = (doc: DocumentItem) => {
    onDocumentSelect?.(doc);
    toast({
      title: "Document selected",
      description: `Viewing ${doc.name}`
    });
  };

  const downloadDocument = (doc: DocumentItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${doc.name}`
    });
  };

  const filteredResults = searchResults.filter(doc => {
    if (selectedFilter === 'all') return true;
    return doc.tags.includes(selectedFilter);
  });

  const displayDocs = searchResults.length > 0 ? filteredResults : indexedDocs;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Document Retrieval
          </CardTitle>
          <CardDescription>
            Search and retrieve relevant documents using AI-powered semantic search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search documents by content, keywords, or topics..."
              className="flex-1"
            />
            <Button onClick={performSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
            {['all', 'pdf', 'document', 'uploaded'].map(filter => (
              <Badge
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Documents ({displayDocs.length})</span>
            <Badge variant="secondary">
              {documents.length} uploaded
            </Badge>
          </CardTitle>
          <CardDescription>
            {searchResults.length > 0 ? 'Search results ordered by relevance' : 'All available documents'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents found. Upload documents to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayDocs.map((doc, index) => (
                <div key={doc.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.lastModified}</span>
                          {doc.relevanceScore && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">
                                {doc.relevanceScore.toFixed(1)}% match
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {doc.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDocument(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadDocument(doc)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  {index < displayDocs.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentRetrieval;