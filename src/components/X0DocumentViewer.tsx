import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Eye, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DocxViewer from './DocxViewer';

interface X0DocumentViewerProps {
  x0Files: File[];
}

const X0DocumentViewer: React.FC<X0DocumentViewerProps> = ({ x0Files }) => {
  const [fileContents, setFileContents] = useState<{[key: string]: string}>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (x0Files.length > 0 && !selectedFile) {
      setSelectedFile(x0Files[0]);
    }
  }, [x0Files, selectedFile]);

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
        resolve(`[${file.type || 'Unknown'} file - ${file.name}]\n\nThis file type cannot be displayed as text. File size: ${(file.size / 1024).toFixed(1)} KB`);
      }
    });
  };

  const loadFileContent = async (file: File) => {
    if (fileContents[file.name]) return;
    
    setLoading(true);
    try {
      const content = await readFileContent(file);
      setFileContents(prev => ({ ...prev, [file.name]: content }));
    } catch (error) {
      console.error('Error reading file:', error);
      setFileContents(prev => ({ 
        ...prev, 
        [file.name]: `Error reading file: ${file.name}` 
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!file.name.toLowerCase().endsWith('.docx')) {
      loadFileContent(file);
    }
  };

  const handleExtractedText = (text: string) => {
    if (selectedFile) {
      setFileContents(prev => ({ ...prev, [selectedFile.name]: text }));
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    
    const content = fileContents[selectedFile.name] || 'File content not loaded';
    const x1Content = `# X1 Milestone - ${selectedFile.name}\n\n## Original X0 Document Content\n\n${content}\n\n## Analysis and Next Steps\n\n[This section would contain AI-generated analysis of the X0 document]`;
    
    const blob = new Blob([x1Content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `X1_${selectedFile.name.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isDocxFile = (file: File) => file.name.toLowerCase().endsWith('.docx');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            X0 Document Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {x0Files.length > 0 ? (
            <div className="space-y-4">
              {x0Files.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {x0Files.map((file, index) => (
                    <Button
                      key={index}
                      variant={selectedFile?.name === file.name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFileSelect(file)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {file.name}
                    </Button>
                  ))}
                </div>
              )}
              
              {selectedFile && (
                <>
                  {isDocxFile(selectedFile) ? (
                    <DocxViewer 
                      file={selectedFile} 
                      onExtractedText={handleExtractedText}
                    />
                  ) : (
                    <>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Viewing: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </AlertDescription>
                      </Alert>
                      
                      <div className="bg-white p-6 rounded-lg border max-h-96 overflow-y-auto">
                        {loading ? (
                          <p className="text-gray-500">Loading file content...</p>
                        ) : fileContents[selectedFile.name] ? (
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                            {fileContents[selectedFile.name]}
                          </pre>
                        ) : (
                          <div>
                            <p className="text-gray-500 mb-2">Click to load file content:</p>
                            <Button onClick={() => loadFileContent(selectedFile)} variant="outline" size="sm">
                              Load {selectedFile.name}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download as X1 Milestone
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No X0 documents uploaded. Please upload X0 documents in the Upload tab first.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default X0DocumentViewer;