import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Resource {
  role: string;
  name: string;
  hours: string;
  comments: string;
}

interface X1DocumentIndexPart2Props {
  functionalRequirements: string;
  setFunctionalRequirements: (value: string) => void;
  businessRisk: string;
  setBusinessRisk: (value: string) => void;
  projectRisk: string;
  setProjectRisk: (value: string) => void;
  riskNotProceeding: string;
  setRiskNotProceeding: (value: string) => void;
  costRisk: string;
  setCostRisk: (value: string) => void;
  quantBenefits: string;
  setQuantBenefits: (value: string) => void;
  qualBenefits: string;
  setQualBenefits: (value: string) => void;
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  dependencies: string;
  setDependencies: (value: string) => void;
  quantCriteria: string;
  setQuantCriteria: (value: string) => void;
  qualCriteria: string;
  setQualCriteria: (value: string) => void;
  businessImpacts: string;
  setBusinessImpacts: (value: string) => void;
  appendixInfo: string;
  setAppendixInfo: (value: string) => void;
}

const X1DocumentIndexPart2: React.FC<X1DocumentIndexPart2Props> = ({
  functionalRequirements,
  setFunctionalRequirements,
  businessRisk,
  setBusinessRisk,
  projectRisk,
  setProjectRisk,
  riskNotProceeding,
  setRiskNotProceeding,
  costRisk,
  setCostRisk,
  quantBenefits,
  setQuantBenefits,
  qualBenefits,
  setQualBenefits,
  resources,
  setResources,
  dependencies,
  setDependencies,
  quantCriteria,
  setQuantCriteria,
  qualCriteria,
  setQualCriteria,
  businessImpacts,
  setBusinessImpacts,
  appendixInfo,
  setAppendixInfo
}) => {
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
    <div className="space-y-6">
      {/* Must-Have Functional Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Must-Have Functional Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={functionalRequirements}
            onChange={(e) => setFunctionalRequirements(e.target.value)}
            placeholder="List must-have functional requirements"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Risks */}
      <Card>
        <CardHeader>
          <CardTitle>Risks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessRisk">Business Risk</Label>
            <Textarea
              id="businessRisk"
              value={businessRisk}
              onChange={(e) => setBusinessRisk(e.target.value)}
              placeholder="Describe business risks"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="projectRisk">Project Risk</Label>
            <Textarea
              id="projectRisk"
              value={projectRisk}
              onChange={(e) => setProjectRisk(e.target.value)}
              placeholder="Describe project risks"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="riskNotProceeding">Risk of Not Proceeding</Label>
            <Textarea
              id="riskNotProceeding"
              value={riskNotProceeding}
              onChange={(e) => setRiskNotProceeding(e.target.value)}
              placeholder="Describe risks of not proceeding"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="costRisk">Risk to Cost</Label>
            <Textarea
              id="costRisk"
              value={costRisk}
              onChange={(e) => setCostRisk(e.target.value)}
              placeholder="Describe cost risks"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Investments, Benefits, and Return Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Investments, Benefits, and Return Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border-2 border-dashed border-gray-300 text-center text-gray-500">
            ROI Worksheet Placeholder
          </div>
          
          <div className="p-4 border-2 border-dashed border-gray-300 text-center text-gray-500">
            Budget Summary Table Placeholder
          </div>
          
          <div>
            <Label htmlFor="quantBenefits">Quantitative Benefits</Label>
            <Textarea
              id="quantBenefits"
              value={quantBenefits}
              onChange={(e) => setQuantBenefits(e.target.value)}
              placeholder="List quantitative benefits"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="qualBenefits">Qualitative Benefits</Label>
            <Textarea
              id="qualBenefits"
              value={qualBenefits}
              onChange={(e) => setQualBenefits(e.target.value)}
              placeholder="List qualitative benefits"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resource Level of Effort Estimate */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Level of Effort Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={resource.role}
                      onChange={(e) => updateResource(index, 'role', e.target.value)}
                      placeholder="Role"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={resource.name}
                      onChange={(e) => updateResource(index, 'name', e.target.value)}
                      placeholder="Name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={resource.hours}
                      onChange={(e) => updateResource(index, 'hours', e.target.value)}
                      placeholder="Hours"
                      type="number"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={resource.comments}
                      onChange={(e) => updateResource(index, 'comments', e.target.value)}
                      placeholder="Comments"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeResource(index)}
                      disabled={resources.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addResource} variant="outline" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border-2 border-dashed border-gray-300 text-center text-gray-500">
            Gantt Chart Placeholder
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            placeholder="List project dependencies"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Success Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Success Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quantCriteria">Quantitative Metrics</Label>
            <Textarea
              id="quantCriteria"
              value={quantCriteria}
              onChange={(e) => setQuantCriteria(e.target.value)}
              placeholder="Define quantitative success metrics"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="qualCriteria">Qualitative Metrics</Label>
            <Textarea
              id="qualCriteria"
              value={qualCriteria}
              onChange={(e) => setQualCriteria(e.target.value)}
              placeholder="Define qualitative success metrics"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Architecture Impacts */}
      <Card>
        <CardHeader>
          <CardTitle>Business Architecture Impacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={businessImpacts}
            onChange={(e) => setBusinessImpacts(e.target.value)}
            placeholder="Describe business architecture impacts"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Appendix A */}
      <Card>
        <CardHeader>
          <CardTitle>Appendix A: Supplemental Supporting Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={appendixInfo}
            onChange={(e) => setAppendixInfo(e.target.value)}
            placeholder="Add supplemental supporting information"
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default X1DocumentIndexPart2;