import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import X1WorkingCopy from './X1WorkingCopy';
import X1CompleteIndex from './X1CompleteIndex';

interface X1MilestoneTemplateProps {
  projectTitle: string;
  onProjectTitleChange: (title: string) => void;
  x0Files?: File[];
}

const X1MilestoneTemplate: React.FC<X1MilestoneTemplateProps> = ({
  projectTitle,
  onProjectTitleChange,
  x0Files = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [x0ApprovalDate, setX0ApprovalDate] = useState('');
  const [x0Status, setX0Status] = useState('Approved / Declined');
  const [x0Comment, setX0Comment] = useState('');
  const [x1ApprovalDate, setX1ApprovalDate] = useState('');
  const [x1Status, setX1Status] = useState('Approved / Declined');
  const [x1Comment, setX1Comment] = useState('');

  const totalPages = 4;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPage1 = () => (
    <div className="max-w-4xl mx-auto bg-white min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">X1 Working Copy</h2>
      <X1WorkingCopy x0Files={x0Files} />
    </div>
  );

  const renderPage2 = () => (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      <div className="text-center py-12 border-b">
        <Input
          value={projectTitle}
          onChange={(e) => onProjectTitleChange(e.target.value)}
          className="text-3xl font-bold text-center border-none text-gray-900 bg-transparent"
          placeholder="Project Title Here"
        />
      </div>

      <div className="text-center py-16">
        <h2 className="text-4xl font-bold text-gray-900">X1 Milestone</h2>
      </div>

      <div className="flex justify-center py-8">
        <div className="bg-red-800 text-white px-6 py-4 flex items-center gap-3">
          <span className="text-2xl font-bold">apei</span>
          <div className="text-sm">
            <div className="font-semibold">AMERICAN PUBLIC</div>
            <div className="font-semibold">EDUCATION, INC.</div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black mt-8">
        <div className="bg-gray-100 px-4 py-3 border-b border-black">
          <h3 className="text-lg font-bold text-center">IT Steering Committee Action</h3>
        </div>
        
        <div className="grid grid-cols-4 border-b border-gray-300">
          <div className="p-3 border-r border-gray-300 font-semibold bg-gray-50">
            X0 Approval
          </div>
          <div className="p-3 border-r border-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Input
                type="date"
                value={x0ApprovalDate}
                onChange={(e) => setX0ApprovalDate(e.target.value)}
                className="border-none bg-transparent text-sm"
                placeholder="Click here to enter a date"
              />
            </div>
          </div>
          <div className="p-3 border-r border-gray-300">
            <select 
              value={x0Status}
              onChange={(e) => setX0Status(e.target.value)}
              className="w-full bg-transparent border-none text-sm"
            >
              <option>Approved / Declined</option>
              <option>Approved</option>
              <option>Declined</option>
            </select>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <Input
                value={x0Comment}
                onChange={(e) => setX0Comment(e.target.value)}
                className="border-none bg-transparent text-sm"
                placeholder="Comment"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4">
          <div className="p-3 border-r border-gray-300 font-semibold bg-gray-50">
            X1 Approval
          </div>
          <div className="p-3 border-r border-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Input
                type="date"
                value={x1ApprovalDate}
                onChange={(e) => setX1ApprovalDate(e.target.value)}
                className="border-none bg-transparent text-sm"
                placeholder="Click here to enter a date"
              />
            </div>
          </div>
          <div className="p-3 border-r border-gray-300">
            <select 
              value={x1Status}
              onChange={(e) => setX1Status(e.target.value)}
              className="w-full bg-transparent border-none text-sm"
            >
              <option>Approved / Declined</option>
              <option>Approved</option>
              <option>Declined</option>
            </select>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <Input
                value={x1Comment}
                onChange={(e) => setX1Comment(e.target.value)}
                className="border-none bg-transparent text-sm"
                placeholder="Comment"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="max-w-4xl mx-auto bg-white min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">X1 Document Index</h2>
      <p className="text-gray-600 mb-6">Complete project proposal document index with all required sections.</p>
      <X1CompleteIndex
        projectTitle={projectTitle}
        onProjectTitleChange={onProjectTitleChange}
      />
    </div>
  );

  const renderPage4 = () => (
    <div className="max-w-4xl mx-auto bg-white min-h-screen p-8">
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">X1 Milestone Complete</h2>
        <p className="text-lg text-gray-600 mb-8">
          Your X1 Project Proposal document is ready for review and submission.
        </p>
        <div className="space-y-4">
          <Button size="lg" className="w-full max-w-md">
            Export Document
          </Button>
          <Button variant="outline" size="lg" className="w-full max-w-md">
            Save Draft
          </Button>
          <Button variant="outline" size="lg" className="w-full max-w-md">
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1: return renderPage1();
      case 2: return renderPage2();
      case 3: return renderPage3();
      case 4: return renderPage4();
      default: return renderPage1();
    }
  };

  return (
    <div className="relative">
      {renderCurrentPage()}
      
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white shadow-lg rounded-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm px-3">
          Page {currentPage}/{totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default X1MilestoneTemplate;