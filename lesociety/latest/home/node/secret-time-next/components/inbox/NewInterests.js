import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const NewInterests = ({ interestCount = 0, activeDatesCount = 0 }) => {
  const router = useRouter();

  const handleCreateDate = () => {
    router.push('/create-date');
  };

  return (
    <Section>
      <SectionTitle>New Interests</SectionTitle>
      
      <InterestCard>
        <InterestText>
          {interestCount === 0 ? 'You have no new interests' : `You have ${interestCount} new interest${interestCount !== 1 ? 's' : ''}`}
        </InterestText>
        <InterestCount>{interestCount}</InterestCount>
        <InterestSubtext>
          {activeDatesCount} active {activeDatesCount === 1 ? 'date' : 'dates'} is live on gallery
        </InterestSubtext>
      </InterestCard>

      {activeDatesCount === 0 && (
        <CreateButton onClick={handleCreateDate}>
          CREATE NEW DATE
        </CreateButton>
      )}
    </Section>
  );
};

export default NewInterests;

const Section = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #888888;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InterestCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: center;
`;

const InterestText = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 8px;
`;

const InterestCount = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 40px;
  font-weight: 300;
  color: #ffffff;
  margin-bottom: 4px;
`;

const InterestSubtext = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #888888;
`;

const CreateButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #F24462 0%, #E2466B 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;

  &:hover {
    background: linear-gradient(90deg, #E2466B 0%, #F24462 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(242, 68, 98, 0.4);
  }
`;
