import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import starBadgeIcon from '../../assets/request star.png';

const PendingRequests = ({ requests = [], ignoredCount = 0, rejectedCount = 0 }) => {
  if (requests.length === 0) {
    return (
      <Section>
        <SectionTitle>Pending Requests</SectionTitle>
        <QuietCard>
          <h4>All Quiet For Now</h4>
          <p>You have no new requests today. Find your next connection in the gallery.</p>
        </QuietCard>
        <StatusRow>
          <StatusItem>(0) Ignored (Refunded after 48h)</StatusItem>
          <StatusItem>(0) Rejected (No refund)</StatusItem>
        </StatusRow>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>Pending Requests</SectionTitle>
      
      <RequestsRow>
        {requests.map((request, index) => (
          <RequestCircle key={request.id || index} onClick={() => window.location.href = `/user/user-profile/${request.userName}`}>
            <ProfileImage src={request.profileImage} alt={request.name} />
            {request.isSuperInterested && (
              <StarBadge>
                <Image src={starBadgeIcon} alt="Super Interested" width={14} height={14} />
              </StarBadge>
            )}
          </RequestCircle>
        ))}
      </RequestsRow>
      
      <StatusRow>
        <StatusItem>({ignoredCount}) Ignored (Refunded after 48h)</StatusItem>
        <StatusItem>({rejectedCount}) Rejected (No refund)</StatusItem>
      </StatusRow>
    </Section>
  );
};

export default PendingRequests;

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

const RequestsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const RequestCircle = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #F24462;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StarBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #F24462;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatusItem = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #888888;
`;

const QuietCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  text-align: center;

  h4 {
    font-size: 16px;
    color: #ffffff;
    margin: 0 0 6px;
    font-weight: 600;
  }

  p {
    font-size: 12px;
    color: #b0b0b0;
    margin: 0;
  }
`;
