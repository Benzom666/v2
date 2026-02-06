import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Image from 'next/image';

const NewInterests = ({ interestCount = 0, activeDatesCount = 0 }) => {
  const router = useRouter();

  const handleCreateDate = () => {
    router.push('/create-date/choose-city?showIntro=true');
  };

  return (
    <Section>
      <SectionTitle>New Interests</SectionTitle>
      
      <InterestCard>
        <InterestCopy>
          <InterestText>
            {interestCount === 0
              ? "You have no new interests"
              : `You have ${interestCount} new interest${interestCount !== 1 ? "s" : ""}`}
          </InterestText>
          <InterestSubtext>
            {activeDatesCount} active {activeDatesCount === 1 ? "date" : "dates"}{" "}
            {activeDatesCount === 1 ? "is" : "are"} live on gallery
          </InterestSubtext>
        </InterestCopy>
        <InterestRing>
          <Image src={require('../../assets/bestring.png')} alt="Interest Ring" width={80} height={80} />
          <span className="ring-value">{interestCount}</span>
        </InterestRing>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const InterestCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InterestText = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 8px;
`;

const InterestSubtext = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #888888;
`;

const InterestRing = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .ring-value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
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
