import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import close1 from "../assets/close1.png";

const PromoModals = ({ isOpen, onClose, type = "success" }) => {
  const router = useRouter();

  if (!isOpen) return null;

  // 50% Off Popup
  if (type === "promo_50_off") {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <img src={close1} alt="close" width={24} height={24} style={{ filter: "invert(1)" }} />
          </CloseButton>

          <ModalBody>
            <Title>She's offering a first date! Don't miss it.</Title>
            <BodyText>
              She's real, verified, and driven. Her goals{" "}
              <Underlined>deserve men who value them</Underlined>.
            </BodyText>

            <OfferSection>
              <OfferTitle>50% Off All Plans.</OfferTitle>
              <OfferSubtitle>Limited-Time Only</OfferSubtitle>

              <TimerSection>
                <TimerText>Exclusive offer ends in</TimerText>
                <TimerValue>48 hours</TimerValue>
              </TimerSection>

              <ProgressBar>
                <ProgressFill />
              </ProgressBar>
            </OfferSection>

            <CTASection>
              <CreateDateButton onClick={() => router.push("/create-date/choose-city?showIntro=true")}>
                CREATE NEW DATE
              </CreateDateButton>
              <DisclaimerText>
                This plan is only available for a limited time. No hidden fees or strings attached you can cancel anytime.
              </DisclaimerText>
            </CTASection>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // Not Live Yet Popup
  if (type === "not_live") {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <img src={close1} alt="close" width={24} height={24} style={{ filter: "invert(1)" }} />
          </CloseButton>

          <ModalBody>
            <Title>You Are Not Live Yet.</Title>
            <BodyText>
              You're seeing other women's dates for style, pricing, and inspiration.{" "}
              Our community attracts high-status men who value privacy; they appear after they message you.
            </BodyText>

            <OfferSection>
              <OfferText>Post your date so men can discover you first.</OfferText>
            </OfferSection>

            <CTASection>
              <CreateDateButton onClick={() => router.push("/create-date/choose-city?showIntro=true")}>
                CREATE NEW DATE
              </CreateDateButton>
            </CTASection>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // Success You're Live Popup
  if (type === "success") {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <img src={close1} alt="close" width={24} height={24} style={{ filter: "invert(1)" }} />
          </CloseButton>

          <ModalBody>
            <Title>Success. You're live!</Title>
            <BodyText>
              Gentleman's profiles remain private until they message you.{" "}
              Our community attracts high-status men who value privacy.
            </BodyText>

            <OfferSection>
              <OfferText>While you wait, explore other women's dates for style, pricing, and inspiration.</OfferText>
            </OfferSection>

            <CTASection>
              <CreateDateButton onClick={onClose}>
                Ok, got it
              </CreateDateButton>
            </CTASection>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // First 3 Free Popup
  if (type === "first_3_free") {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <img src={close1} alt="close" width={24} height={24} style={{ filter: "invert(1)" }} />
          </CloseButton>

          <ModalBody>
            <Title>Your first 3 accepted interests are Free!</Title>
            <BodyText>
              Open a private interest and start a chat. Your first 3 are on us.
            </BodyText>

            <OfferSection>
              <CounterText>3 of 3 conversations left</CounterText>
            </OfferSection>

            <CTASection>
              <CreateDateButton onClick={() => router.push("/create-date/choose-city?showIntro=true")}>
                CREATE NEW DATE
              </CreateDateButton>
            </CTASection>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return null;
};

export default PromoModals;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: linear-gradient(222.9deg, rgba(46, 49, 58, 0.7) 11.9%, rgba(25, 25, 25, 0.9) 69.4%),
              linear-gradient(90deg, rgba(1, 1, 1, 0.5) 0%, rgba(1, 1, 1, 0.5) 100%);
  backdrop-filter: blur(13.5px);
  border-radius: 30px 30px 0 0;
  width: 100%;
  max-width: 420px;
  padding: 28px 16px 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 24px 12px 16px;
    gap: 32px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 19px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  width: 24px;
  height: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ModalBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const Title = styled.h2`
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-weight: bold;
  font-size: 28px;
  color: white;
  text-align: center;
  margin: 0;
  line-height: 1.2;
  font-feature-settings: 'ordn' 1, 'dlig' 1;
`;

const BodyText = styled.p`
  font-family: 'Helvetica Light', 'Helvetica', 'Arial', sans-serif;
  font-size: 14px;
  color: white;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;

const Underlined = styled.span`
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
`;

const OfferSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const OfferTitle = styled.h3`
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: white;
  text-align: center;
  margin: 0;
  line-height: 1.2;
  font-feature-settings: 'ordn' 1, 'dlig' 1;

  p {
    margin: 0;
  }
`;

const OfferSubtitle = styled.p`
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-weight: normal;
  font-size: 24px;
  color: white;
  text-align: center;
  margin: 0;
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 358px;
`;

const TimerText = styled.p`
  font-family: 'Helvetica Light', 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  color: #a8a8a8;
  text-align: right;
  margin: 0;
  width: 100%;
`;

const TimerValue = styled.p`
  font-family: 'Helvetica Light', 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  color: white;
  text-align: center;
  margin: 0;
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 75%;
  background: linear-gradient(90deg, #f24462 0%, #4a90e2 100%);
  border-radius: 4px;
  animation: progressPulse 2s ease-in-out infinite;

  @keyframes progressPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const OfferText = styled.p`
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  color: #d1d5db;
  text-align: center;
  margin: 0;
  line-height: 1.2;
  font-feature-settings: 'ordn' 1, 'dlig' 1;
`;

const CounterText = styled.p`
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 24px;
  color: #d1d5db;
  text-align: center;
  margin: 0;
  line-height: 1.2;
  font-feature-settings: 'ordn' 1, 'dlig' 1;
`;

const CTASection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CreateDateButton = styled.button`
  background-color: #f24462;
  border: none;
  border-radius: 8px;
  height: 48px;
  width: 300px;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-align: center;
  cursor: pointer;
  letter-spacing: -0.07px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e03e58;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DisclaimerText = styled.p`
  font-family: 'Helvetica Light', 'Helvetica', 'Arial', sans-serif;
  font-size: 12px;
  color: white;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  letter-spacing: -0.06px;
`;
