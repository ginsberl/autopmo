import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface X1DocumentIndexProps {
  projectTitle: string;
  onProjectTitleChange: (title: string) => void;
}

const X1DocumentIndex: React.FC<X1DocumentIndexProps> = ({
  projectTitle,
  onProjectTitleChange
}) => {
  const [milestoneStatus, setMilestoneStatus] = useState('');
  const [x0Approved, setX0Approved] = useState(false);
  const [x1Approved, setX1Approved] = useState(false);
  const [businessUnit, setBusinessUnit] = useState('');
  const [executiveSponsor, setExecutiveSponsor] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [keyContributors, setKeyContributors] = useState('');
  const [impactedUnits, setImpactedUnits] = useState('');
  const [businessNeed, setBusinessNeed] = useState('');
  const [proposedProject, setProposedProject] = useState('');
  const [strategicAlignment, setStrategicAlignment] = useState({
    winWithEmployees: false,
    driveEfficiency: false,
    driveGrowth: false,
    winWithStudents: false,
    maintainCompliance: false,
    other: false
  });
  const [portfolioCategory, setPortfolioCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [functionalRequirements, setFunctionalRequirements] = useState('');
  const [businessRisk, setBusinessRisk] = useState('');
  const [projectRisk, setProjectRisk] = useState('');
  const [riskNotProceeding, setRiskNotProceeding] = useState('');
  const [costRisk, setCostRisk] = useState('');
  const [quantBenefits, setQuantBenefits] = useState('');
  const [qualBenefits, setQualBenefits] = useState('');
  const [resources, setResources] = useState([{ role: '', name: '', hours: '', comments: '' }]);
  const [sowRequired, setSowRequired] = useState('');
  const [sowSigned, setSowSigned] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [quantCriteria, setQuantCriteria] = useState('');
  const [qualCriteria, setQualCriteria] = useState('');
  const [businessImpacts, setBusinessImpacts] = useState('');
  const [appendixInfo, setAppendixInfo] = useState('');

  const addResource = () => {
    setResources([...resources, { role: '', name: '', hours: '', comments: '' }]);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index: number, field: string, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 space-y-6">
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold mb-4">X1 Project Proposal – Document Index</h1>
      </div>

      {/* Project Header */}
      <Card>
        <CardHeader>
          <CardTitle>Project Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="projectTitle">Project Title</Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => onProjectTitleChange(e.target.value)}
              placeholder="Enter project title"
            />
          </div>
          
          <div>
            <Label htmlFor="milestoneStatus">X1 Milestone Status</Label>
            <Select value={milestoneStatus} onValueChange={setMilestoneStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>IT Steering Committee Action</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="x0Approved"
                  checked={x0Approved}
                  onCheckedChange={setX0Approved}
                />
                <Label htmlFor="x0Approved">X0 Approved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="x1Approved"
                  checked={x1Approved}
                  onCheckedChange={setX1Approved}
                />
                <Label htmlFor="x1Approved">X1 Approved</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsorship</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessUnit">Business Unit</Label>
            <Input
              id="businessUnit"
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              placeholder="Enter business unit"
            />
          </div>
          
          <div>
            <Label htmlFor="executiveSponsor">Executive Sponsor</Label>
            <Input
              id="executiveSponsor"
              value={executiveSponsor}
              onChange={(e) => setExecutiveSponsor(e.target.value)}
              placeholder="Enter executive sponsor"
            />
          </div>
          
          <div>
            <Label htmlFor="projectOwner">Project Owner</Label>
            <Input
              id="projectOwner"
              value={projectOwner}
              onChange={(e) => setProjectOwner(e.target.value)}
              placeholder="Enter project owner"
            />
          </div>
          
          <div>
            <Label htmlFor="keyContributors">Key Contributors</Label>
            <Textarea
              id="keyContributors"
              value={keyContributors}
              onChange={(e) => setKeyContributors(e.target.value)}
              placeholder="List key contributors"
            />
          </div>
          
          <div>
            <Label htmlFor="impactedUnits">Other Impacted Business Units</Label>
            <Textarea
              id="impactedUnits"
              value={impactedUnits}
              onChange={(e) => setImpactedUnits(e.target.value)}
              placeholder="List other impacted business units"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statement of Business Need */}
      <Card>
        <CardHeader>
          <CardTitle>Statement of Business Need</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={businessNeed}
            onChange={(e) => setBusinessNeed(e.target.value)}
            placeholder="Describe the business need"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Proposed Project */}
      <Card>
        <CardHeader>
          <CardTitle>Proposed Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={proposedProject}
            onChange={(e) => setProposedProject(e.target.value)}
            placeholder="Describe the proposed project"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Strategic Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>List of strategic imperatives</Label>
            <div className="space-y-2">
              {Object.entries(strategicAlignment).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setStrategicAlignment(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Categorization */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Categorization</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={portfolioCategory} onValueChange={setPortfolioCategory}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business-opportunity" id="business-opportunity" />
              <Label htmlFor="business-opportunity">Business Opportunity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="innovation" id="innovation" />
              <Label htmlFor="innovation">Innovation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maintenance" id="maintenance" />
              <Label htmlFor="maintenance">Maintenance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mandatory" id="mandatory" />
              <Label htmlFor="mandatory">Mandatory</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Urgency */}
      <Card>
        <CardHeader>
          <CardTitle>Urgency</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            placeholder="Describe the urgency of this project"
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default X1DocumentIndex;