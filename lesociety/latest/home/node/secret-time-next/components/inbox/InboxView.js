import React from 'react';
import styled from 'styled-components';
import EmptyState from './EmptyState';
import PendingRequests from './PendingRequests';
import NewInterests from './NewInterests';
import Image from 'next/image';
import StarIcon from '../../assets/request star.png';

/**
 * New Inbox View Component
 * Wraps the new chat/inbox design for both men and women
 */
const InboxView = ({ 
  conversations = [], 
  user = {}, 
  onConversationClick,
  showTime,
  showText,
  loading = false
}) => {
  const isMale = user?.gender === 'male';
  const hasConversations = conversations && conversations.length > 0;

  // Mock data - replace with real API data
  const pendingRequests = []; // TODO: Get from API
  const ignoredCount = 0; // TODO: Get from user data
  const rejectedCount = 0; // TODO: Get from user data
  const interestCount = 0; // TODO: Get from API
  const activeDatesCount = user?.active_dates_count || 0;

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <InboxContainer>
      {/* Header Section - Pending Requests (Men) or New Interests (Women) */}
      {isMale && pendingRequests.length > 0 && (
        <PendingRequests 
          requests={pendingRequests}
          ignoredCount={ignoredCount}
          rejectedCount={rejectedCount}
        />
      )}
      
      {!isMale && (
        <NewInterests 
          interestCount={interestCount}
          activeDatesCount={activeDatesCount}
        />
      )}

      {/* Empty State or Conversation List */}
      {!hasConversations ? (
        <EmptyState gender={user?.gender} activeDatesCount={activeDatesCount} />
      ) : (
        <>
          <SectionHeader>Active Conversations</SectionHeader>
          <ConversationList>
            {conversations.map((c, index) => (
              <ConversationItem 
                key={c?._id || index}
                onClick={() => onConversationClick(c)}
                isUnread={c?.message && !c?.message?.read_date_time && c?.message?.sender_id !== user?._id}
              >
                <ProfileImage>
                  <img 
                    src={c?.user?.profile_image || '/images/default-avatar.png'} 
                    alt={c?.user?.user_name}
                    width={48}
                    height={48}
                  />
                </ProfileImage>
                
                <ConversationContent>
                  <ConversationHeader>
                    <UserName>
                      {c?.isSuperInterested && (
                        <StarIcon>
                          <Image src={StarIcon} height={16} width={16} alt="Super Interested" />
                        </StarIcon>
                      )}
                      <span className={c?.isSuperInterested ? 'super-interested' : ''}>
                        {c?.user?.user_name || 'Unknown User'}
                      </span>
                    </UserName>
                    <Timestamp>
                      {c?.message && showTime ? showTime(c?.message?.sent_time) : ''}
                    </Timestamp>
                  </ConversationHeader>
                  
                  <MessagePreview isUnread={c?.message && !c?.message?.read_date_time && c?.message?.sender_id !== user?._id}>
                    {c?.message?.message && showText ? showText(c?.message?.message) : 'No messages yet'}
                  </MessagePreview>
                </ConversationContent>
                
                {c?.message && !c?.message?.read_date_time && c?.message?.sender_id !== user?._id && (
                  <UnreadDot />
                )}
              </ConversationItem>
            ))}
          </ConversationList>
        </>
      )}
    </InboxContainer>
  );
};

export default InboxView;

// Styled Components
const InboxContainer = styled.div`
  background: #000000;
  min-height: 100vh;
  color: #ffffff;

  @media (max-width: 768px) {
    min-height: calc(100vh - 60px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #ffffff;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
`;

const SectionHeader = styled.h3`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #888888;
  margin: 0;
  padding: 16px 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ConversationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ConversationItem = styled.li`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  background: ${props => props.isUnread ? 'rgba(242, 68, 98, 0.05)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ConversationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;

  .super-interested {
    color: #F24462;
  }
`;

const Timestamp = styled.span`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #888888;
`;

const MessagePreview = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 13px;
  font-weight: ${props => props.isUnread ? '600' : '400'};
  color: ${props => props.isUnread ? '#ffffff' : '#b0b0b0'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #F24462;
  flex-shrink: 0;
`;
