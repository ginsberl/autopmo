import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import X1DocumentIndex from './X1DocumentIndex';
import X1DocumentIndexPart2 from './X1DocumentIndexPart2';

interface Resource {
  role: string;
  name: string;
  hours: string;
  comments: string;
}

interface X1CompleteIndexProps {
  projectTitle: string;
  onProjectTitleChange: (title: string) => void;
}

const X1CompleteIndex: React.FC<X1CompleteIndexProps> = ({
  projectTitle,
  onProjectTitleChange
}) => {
  // State for Part 2 components
  const [functionalRequirements, setFunctionalRequirements] = useState('');
  const [businessRisk, setBusinessRisk] = useState('');
  const [projectRisk, setProjectRisk] = useState('');
  const [riskNotProceeding, setRiskNotProceeding] = useState('');
  const [costRisk, setCostRisk] = useState('');
  const [quantBenefits, setQuantBenefits] = useState('');
  const [qualBenefits, setQualBenefits] = useState('');
  const [resources, setResources] = useState<Resource[]>([
    { role: '', name: '', hours: '', comments: '' }
  ]);
  const [dependencies, setDependencies] = useState('');
  const [quantCriteria, setQuantCriteria] = useState('');
  const [qualCriteria, setQualCriteria] = useState('');
  const [businessImpacts, setBusinessImpacts] = useState('');
  const [appendixInfo, setAppendixInfo] = useState('');

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto bg-white p-8">
        <X1DocumentIndex
          projectTitle={projectTitle}
          onProjectTitleChange={onProjectTitleChange}
        />
        
        <div className="mt-8">
          <X1DocumentIndexPart2
            functionalRequirements={functionalRequirements}
            setFunctionalRequirements={setFunctionalRequirements}
            businessRisk={businessRisk}
            setBusinessRisk={setBusinessRisk}
            projectRisk={projectRisk}
            setProjectRisk={setProjectRisk}
            riskNotProceeding={riskNotProceeding}
            setRiskNotProceeding={setRiskNotProceeding}
            costRisk={costRisk}
            setCostRisk={setCostRisk}
            quantBenefits={quantBenefits}
            setQuantBenefits={setQuantBenefits}
            qualBenefits={qualBenefits}
            setQualBenefits={setQualBenefits}
            resources={resources}
            setResources={setResources}
            dependencies={dependencies}
            setDependencies={setDependencies}
            quantCriteria={quantCriteria}
            setQuantCriteria={setQuantCriteria}
            qualCriteria={qualCriteria}
            setQualCriteria={setQualCriteria}
            businessImpacts={businessImpacts}
            setBusinessImpacts={setBusinessImpacts}
            appendixInfo={appendixInfo}
            setAppendixInfo={setAppendixInfo}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default X1CompleteIndex;