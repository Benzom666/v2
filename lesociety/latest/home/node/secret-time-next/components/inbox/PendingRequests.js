import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const PendingRequests = ({ requests = [], ignoredCount = 0, rejectedCount = 0 }) => {
  if (requests.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Pending Requests</SectionTitle>
      
      <RequestsRow>
        {requests.map((request, index) => (
          <RequestCircle key={request.id || index} onClick={() => window.location.href = `/user/user-profile/${request.userName}`}>
            <ProfileImage src={request.profileImage} alt={request.name} />
            {request.isSuperInterested && <StarBadge>⭐</StarBadge>}
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
  font-size: 12px;
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
