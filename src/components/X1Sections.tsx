import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface X1SectionsProps {
  businessNeed: string;
  setBusinessNeed: (value: string) => void;
  proposedProject: string;
  setProposedProject: (value: string) => void;
  strategicAlignment: any;
  setStrategicAlignment: (value: any) => void;
  portfolioCategory: string;
  setPortfolioCategory: (value: string) => void;
  urgency: string;
  setUrgency: (value: string) => void;
}

const X1Sections: React.FC<X1SectionsProps> = ({
  businessNeed,
  setBusinessNeed,
  proposedProject,
  setProposedProject,
  strategicAlignment,
  setStrategicAlignment,
  portfolioCategory,
  setPortfolioCategory,
  urgency,
  setUrgency
}) => {
  return (
    <div className="space-y-8">
      {/* Statement of Business Need */}
      <div className="border-l-4 border-red-500 pl-4">
        <h3 className="text-lg font-bold text-red-600 mb-2">Statement of Business Need</h3>
        <p className="text-sm text-gray-600 mb-2">Describe the core business problem or opportunity the project addresses.</p>
        <p className="text-xs text-green-600 mb-2">✓ Explain why this project matters, what challenges it resolves, and expected value</p>
        <p className="text-xs text-blue-600 mb-4">💡 Tip: Use clear, compelling language; avoid jargon; use needs like productivity, scalability, etc.</p>
        <Textarea
          value={businessNeed}
          onChange={(e) => setBusinessNeed(e.target.value)}
          className="min-h-32"
          placeholder="Describe the core business problem or opportunity..."
        />
      </div>

      {/* Proposed Project */}
      <div className="border-l-4 border-red-500 pl-4">
        <h3 className="text-lg font-bold text-red-600 mb-2">Proposed Project</h3>
        <p className="text-sm text-gray-600 mb-2">Summarize the major project components and scope of work.</p>
        <p className="text-xs text-green-600 mb-2">✓ List primary deliverables or phases</p>
        <p className="text-xs text-blue-600 mb-4">💡 Tip: Break into logical workstreams if complex (e.g., Foundation Platform, AI Agents)</p>
        <Textarea
          value={proposedProject}
          onChange={(e) => setProposedProject(e.target.value)}
          className="min-h-32"
          placeholder="Summarize the major project components..."
        />
      </div>

      {/* Strategic Alignment */}
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-blue-600 mb-2">Strategic Alignment</h3>
        <p className="text-sm text-gray-600 mb-4">Check the imperative(s) with which the proposed project most aligns.</p>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={strategicAlignment.winWithEmployees}
              onCheckedChange={(checked) => setStrategicAlignment(prev => ({...prev, winWithEmployees: !!checked}))}
            />
            <label className="text-sm">Win with Employees (Engaged and Successful Employees)</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={strategicAlignment.driveEfficiency}
              onCheckedChange={(checked) => setStrategicAlignment(prev => ({...prev, driveEfficiency: !!checked}))}
            />
            <label className="text-sm">Drive Efficiency through Stand Out Services</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={strategicAlignment.driveGrowth}
              onCheckedChange={(checked) => setStrategicAlignment(prev => ({...prev, driveGrowth: !!checked}))}
            />
            <label className="text-sm">Drive Organic Growth</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={strategicAlignment.winWithStudents}
              onCheckedChange={(checked) => setStrategicAlignment(prev => ({...prev, winWithStudents: !!checked}))}
            />
            <label className="text-sm">Win with Students</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={strategicAlignment.maintainCompliance}
              onCheckedChange={(checked) => setStrategicAlignment(prev => ({...prev, maintainCompliance: !!checked}))}
            />
            <label className="text-sm">Maintain Top Performing Regulatory & Public Company Compliance</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={strategicAlignment.other}
              onCheckedChange={(checked) => setStrategicAlignment(prev => ({...prev, other: !!checked}))}
            />
            <label className="text-sm">Other</label>
          </div>
        </div>
      </div>

      {/* Portfolio Categorization */}
      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="text-lg font-bold text-green-600 mb-2">Portfolio Categorization</h3>
        <RadioGroup value={portfolioCategory} onValueChange={setPortfolioCategory}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="business-opportunity" id="business-opportunity" />
            <Label htmlFor="business-opportunity" className="text-sm">
              <strong>Business Opportunity:</strong> Investment that delivers new capabilities that drive the realization of business benefits. Typically, initiatives that expand or create lines of business.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="innovation" id="innovation" />
            <Label htmlFor="innovation" className="text-sm">
              <strong>Innovation:</strong> Transformative source of competitive advantage. Typically, initiatives outside current business lines may have complex investment returns.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maintenance" id="maintenance" />
            <Label htmlFor="maintenance" className="text-sm">
              <strong>Maintenance:</strong> Project designed to maintain or improve existing service levels, reduce costs, or optimize asset.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mandatory" id="mandatory" />
            <Label htmlFor="mandatory" className="text-sm">
              <strong>Mandatory:</strong> Investment required for legal, policy, or regulatory compliance.
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Urgency */}
      <div className="border-l-4 border-orange-500 pl-4">
        <h3 className="text-lg font-bold text-orange-600 mb-2">Urgency</h3>
        <p className="text-sm text-gray-600 mb-2">State what drives the timing and necessity of the project.</p>
        <p className="text-xs text-green-600 mb-2">✓ Describe factors like productivity, time sensitivity</p>
        <p className="text-xs text-blue-600 mb-4">💡 Tip: Keep concise, clear on why this must happen now</p>
        <Textarea
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="min-h-24"
          placeholder="State what drives the timing and necessity..."
        />
      </div>
    </div>
  );
};

export default X1Sections;