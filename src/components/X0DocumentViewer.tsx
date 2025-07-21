import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FileText } from 'lucide-react';

interface X0DocumentViewerProps {
  x0Files: { name: string; text: string }[];
}

const X0DocumentViewer: React.FC<X0DocumentViewerProps> = ({ x0Files }) => {
  const [selectedDoc, setSelectedDoc] = useState(x0Files[0] || null);

  useEffect(() => {
    if (x0Files.length > 0 && !selectedDoc) {
      setSelectedDoc(x0Files[0]);
    }
  }, [x0Files, selectedDoc]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          X0 Document Viewer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {x0Files.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {x0Files.map((doc, index) => (
              <Button
                key={index}
                variant={selectedDoc?.name === doc.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDoc(doc)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {doc.name}
              </Button>
            ))}
          </div>
        )}

        {selectedDoc ? (
          <div className="bg-white p-6 rounded-lg border max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {selectedDoc.text}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No document selected.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default X0DocumentViewer;