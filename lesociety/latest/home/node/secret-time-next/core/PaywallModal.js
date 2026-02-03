import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PricingMenuModal from "./PricingMenuModal";

const PaywallModal = ({ 
  isOpen, 
  onClose, 
  type = "men_first_date", // "men_first_date" | "ladies_chat" | "ladies_interest"
  expiresIn = 48, // hours
  userName = "Someone"
}) => {
  const [showPricing, setShowPricing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expiresIn * 3600); // Convert to seconds
  const user = useSelector((state) => state.authReducer.user);
  const isFemale = user?.gender === "female";

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimeLeft = () => {
    const hours = Math.floor(timeLeft / 3600);
    return `${hours} hours`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = expiresIn * 3600;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const handleViewPricing = () => {
    setShowPricing(true);
  };

  const handleClosePricing = () => {
    setShowPricing(false);
  };

  if (!isOpen) return null;

  if (showPricing) {
    return <PricingMenuModal isOpen={true} onClose={handleClosePricing} />;
  }

  // Men's Paywall
  if (type === "men_first_date" && !isFemale) {
    return (
      <ModalOverlay onClick={onClose}>
        <SlideUpContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>×</CloseButton>
          
          <Title>
            She's Offering A First Date! Don't Miss It.
          </Title>
          
          <Subtitle>
            She's real, verified, and driven — her goals deserve men who value them.
          </Subtitle>
          
          <Offer>
            <OfferTitle>50% Off All Tokens.</OfferTitle>
            <OfferSubtitle>Limited-Time Only</OfferSubtitle>
          </Offer>
          
          <TimerSection>
            <TimerText>Exclusive offer ends in {formatTimeLeft()}</TimerText>
            <ProgressBar>
              <ProgressFill progress={getProgressPercentage()} />
            </ProgressBar>
          </TimerSection>
          
          <CTAButton onClick={handleViewPricing}>
            View Token Pricing
          </CTAButton>
          
          <FooterText>
            This plan is only available for a limited time. No hidden fees or strings<br />
            attached you can cancel anytime.
          </FooterText>
        </SlideUpContent>
      </ModalOverlay>
    );
  }

  // Ladies Chat Paywall
  if (type === "ladies_chat" && isFemale) {
    return (
      <ModalOverlay onClick={onClose}>
        <SlideUpContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>×</CloseButton>
          
          <Title>
            Don't let your new<br />interests slip away
          </Title>
          
          <Subtitle>
            Your first 15 introductions were on us.<br />
            Unlock the rest and see who's chosen you<br />
            before they disappear.
          </Subtitle>
          
          <Offer>
            <OfferPrice>$25 for 100 chats</OfferPrice>
            <OfferSubtitle>Limited time only</OfferSubtitle>
          </Offer>
          
          <TimerSection>
            <TimerText>This Interest expires in {formatTimeLeft()}</TimerText>
            <ProgressBar>
              <ProgressFill progress={getProgressPercentage()} />
            </ProgressBar>
          </TimerSection>
          
          <CTAButton onClick={handleViewPricing}>
            VIEW PRICING
          </CTAButton>
          
          <FooterText>
            Pay only for what you use. No recurring fees.
          </FooterText>
        </SlideUpContent>
      </ModalOverlay>
    );
  }

  return null;
};

export default PaywallModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 10000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(180deg, #2a2d35 0%, #1a1d23 100%);
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  padding: 32px 24px;
  position: relative;
  text-align: center;
  animation: slideUp 0.4s ease;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const SlideUpContent = styled(ModalContent)`
  border-radius: 24px 24px 0 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 100%;
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 32px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  font-weight: 300;

  &:hover {
    transform: rotate(90deg);
  }
`;

const Title = styled.h2`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #b0b0b0;
  margin: 0 0 24px;
  line-height: 1.5;
`;

const Offer = styled.div`
  margin: 24px 0;
`;

const OfferTitle = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const OfferPrice = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const OfferSubtitle = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #b0b0b0;
`;

const TimerSection = styled.div`
  margin: 24px 0;
`;

const TimerText = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #4A90E2 0%, #F24462 50%, #F24462 100%);
  border-radius: 3px;
  transition: width 1s linear;
`;

const CTAButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #F24462 0%, #E2466B 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 16px 20px;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 16px 0;

  &:hover {
    background: linear-gradient(90deg, #E2466B 0%, #F24462 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(242, 68, 98, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FooterText = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #808080;
  margin-top: 16px;
  line-height: 1.4;
`;
