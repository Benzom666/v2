import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import nochatImage from '../../assets/nochat.png';
import { useRouter } from 'next/router';

const EmptyState = ({ gender = 'male', activeDatesCount = 0 }) => {
  const router = useRouter();
  const isMale = gender === 'male';

  const handleCreateDate = () => {
    router.push('/create-date');
  };

  return (
    <EmptyStateContainer>
      {isMale ? (
        // Men's Empty State
        <>
          <EmptyHeader>All Quiet For Now</EmptyHeader>
          <EmptySubtext>
            You have no new requests today. Find your<br />
            next connection in the gallery
          </EmptySubtext>
          
          <EmptyIllustration>
            <Image src={nochatImage} alt="No conversations" width={280} height={200} />
          </EmptyIllustration>
          
          <EmptyTitle>No Active Conversations Yet</EmptyTitle>
          <EmptyMessage>
            Every connection starts with a message.<br />
            Make yours count.
          </EmptyMessage>
        </>
      ) : (
        // Women's Empty State
        <>
          <SectionHeader>New Interests</SectionHeader>
          <InterestBox>
            <InterestText>You have no new interests</InterestText>
            <InterestCount>0</InterestCount>
            <InterestSubtext>
              {activeDatesCount} active {activeDatesCount === 1 ? 'date' : 'dates'} is live on gallery
            </InterestSubtext>
          </InterestBox>
          
          <EmptyIllustration>
            <Image src={nochatImage} alt="No conversations" width={280} height={200} />
          </EmptyIllustration>
          
          <EmptyTitle>No Active Conversations Yet</EmptyTitle>
          <EmptyMessage>
            Visibility build Interests. Stay active!
          </EmptyMessage>
          
          <CreateDateButton onClick={handleCreateDate}>
            CREATE NEW DATE
          </CreateDateButton>
        </>
      )}
    </EmptyStateContainer>
  );
};

export default EmptyState;

// Styled Components
const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 60vh;
  background: #000000;
`;

const EmptyHeader = styled.h2`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px;
`;

const EmptySubtext = styled.p`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #b0b0b0;
  margin: 0 0 32px;
  line-height: 1.5;
`;

const SectionHeader = styled.h3`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #888888;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InterestBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 400px;
`;

const InterestText = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 12px;
`;

const InterestCount = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 48px;
  font-weight: 300;
  color: #ffffff;
  margin-bottom: 8px;
`;

const InterestSubtext = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #888888;
`;

const EmptyIllustration = styled.div`
  margin: 32px 0;
  opacity: 0.8;
`;

const EmptyTitle = styled.h3`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px;
`;

const EmptyMessage = styled.p`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #b0b0b0;
  margin: 0;
  line-height: 1.5;
`;

const CreateDateButton = styled.button`
  margin-top: 32px;
  background: linear-gradient(90deg, #F24462 0%, #E2466B 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;

  &:hover {
    background: linear-gradient(90deg, #E2466B 0%, #F24462 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(242, 68, 98, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
