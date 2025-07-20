import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIResponseRatingProps {
  responseId: string;
  onRatingSubmit?: (rating: number, feedback: string) => void;
  showFeedback?: boolean;
}

interface RatingData {
  rating: number;
  feedback: string;
  timestamp: Date;
}

const AIResponseRating: React.FC<AIResponseRatingProps> = ({
  responseId,
  onRatingSubmit,
  showFeedback = true
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (newRating > 0 && !submitted) {
      setShowFeedbackInput(true);
    }
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onRatingSubmit?.(rating, feedback);
      setSubmitted(true);
      
      // Store rating locally
      const ratingData: RatingData = {
        rating,
        feedback,
        timestamp: new Date()
      };
      localStorage.setItem(`ai-rating-${responseId}`, JSON.stringify(ratingData));
    }
  };

  const handleQuickFeedback = (type: 'helpful' | 'not-helpful') => {
    const quickRating = type === 'helpful' ? 4 : 2;
    setRating(quickRating);
    setFeedback(type === 'helpful' ? 'This response was helpful' : 'This response needs improvement');
    handleSubmit();
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <ThumbsUp className="h-4 w-4" />
            <span>Thank you for your feedback!</span>
            <Badge variant="secondary" className="ml-2">
              {rating}/5 stars
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Rate this AI response:
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFeedback('helpful')}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-3 w-3" />
              Helpful
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFeedback('not-helpful')}
              className="flex items-center gap-1"
            >
              <ThumbsDown className="h-3 w-3" />
              Not Helpful
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Rating
            value={rating}
            onChange={handleRatingChange}
            size="md"
          />
          {rating > 0 && (
            <span className="text-sm text-gray-600">
              {rating}/5 stars
            </span>
          )}
        </div>

        {showFeedbackInput && showFeedback && (
          <div className="space-y-2">
            <Textarea
              placeholder="Optional: Share specific feedback about this AI response..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="text-sm"
              rows={2}
            />
            <Button
              onClick={handleSubmit}
              size="sm"
              disabled={rating === 0}
              className="w-full"
            >
              Submit Rating
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResponseRating;