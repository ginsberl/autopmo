import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocxViewerProps {
  file: File;
  onExtractedText?: (text: string) => void;
}

const DocxViewer: React.FC<DocxViewerProps> = ({ file, onExtractedText }) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      const JSZip = (await import('jszip')).default;
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      const documentXml = await zip.file('word/document.xml')?.async('string');
      if (!documentXml) {
        throw new Error('Could not find document.xml in DOCX file');
      }
      
      // Parse XML and extract text content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
      
      // Get all text nodes
      const textNodes = xmlDoc.getElementsByTagName('w:t');
      let extractedText = '';
      
      for (let i = 0; i < textNodes.length; i++) {
        const textContent = textNodes[i].textContent || '';
        extractedText += textContent;
        
        // Add space between text runs for readability
        if (i < textNodes.length - 1) {
          extractedText += ' ';
        }
      }
      
      // Clean up the text
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .trim();
      
      return extractedText || 'No readable text found in this DOCX file.';
    } catch (err) {
      console.error('DOCX extraction error:', err);
      throw new Error('Failed to extract text from DOCX file. The file may be corrupted or use an unsupported format.');
    }
  };

  useEffect(() => {
    const processFile = async () => {
      if (!file.name.toLowerCase().endsWith('.docx')) {
        setError('This component only supports .docx files');
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const text = await extractTextFromDocx(file);
        setExtractedText(text);
        onExtractedText?.(text);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        setExtractedText('');
      } finally {
        setLoading(false);
      }
    };

    processFile();
  }, [file, onExtractedText]);

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace('.docx', '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          DOCX Content Viewer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Viewing: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
          </AlertDescription>
        </Alert>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Extracting text from DOCX file...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {extractedText && !loading && (
          <>
            <div className="bg-white p-6 rounded-lg border max-h-96 overflow-y-auto mb-4">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {extractedText}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Extracted Text
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DocxViewer;