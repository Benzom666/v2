import React, { useState } from "react";
import styled from "styled-components";
import close1 from "../assets/close1.png";
import Image from "next/image";
import arrow1 from "../assets/arrow1.svg";
import arrow2 from "../assets/arrow2.svg";
import interestedIcon from "../assets/interested.svg";
import superInterestedIcon from "../assets/superinterested.svg";
import { useDispatch } from "react-redux";
import { updateUserTokens } from "../modules/auth/authActions";
import { useSelector } from "react-redux";

const PricingMenuModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const isFemale = user?.gender === "female";

  // Men's pricing state
  const [interestedCount, setInterestedCount] = useState(0);
  const [superInterestedCount, setSuperInterestedCount] = useState(0);

  // Women's pricing state
  const [aLaCarteCount, setALaCarteCount] = useState(0);
  const [queensBundleCount, setQueensBundleCount] = useState(0);

  const INTERESTED_PRICE = 2;
  const SUPER_INTERESTED_PRICE = 4;
  const MIN_PURCHASE_MEN = 25;

  const A_LA_CARTE_PRICE = 0.50; // 50 cents per chat
  const QUEENS_BUNDLE_PRICE = 25; // $25 for 100 chats
  const QUEENS_BUNDLE_CHATS = 100;
  const MIN_PURCHASE_WOMEN = 10;

  const calculateTotal = () => {
    if (isFemale) {
      return (aLaCarteCount * A_LA_CARTE_PRICE) + (queensBundleCount * QUEENS_BUNDLE_PRICE);
    } else {
      return (interestedCount * INTERESTED_PRICE) + (superInterestedCount * SUPER_INTERESTED_PRICE);
    }
  };

  const calculateTotalChats = () => {
    return aLaCarteCount + (queensBundleCount * QUEENS_BUNDLE_CHATS);
  };

  const total = calculateTotal();
  const minPurchase = isFemale ? MIN_PURCHASE_WOMEN : MIN_PURCHASE_MEN;
  const canCheckout = total >= minPurchase;

  const handleCheckout = () => {
    if (!canCheckout) return;

    // Dummy payment - always succeeds for testing
    console.log('Processing payment:', {
      isFemale,
      total,
      timestamp: new Date().toISOString()
    });

    if (isFemale) {
      const totalChats = calculateTotalChats();
      console.log('Women purchase:', {
        aLaCarteCount,
        queensBundleCount,
        totalChats,
        total
      });
      alert(`Payment Successful! $${total} processed.\n\nYou received:\n• ${aLaCarteCount} A La' Carte chats\n• ${queensBundleCount} Queens Bundle (${queensBundleCount * QUEENS_BUNDLE_CHATS} chats)\n\nTotal: ${totalChats} new chats!`);
    } else {
      console.log('Men purchase:', {
        interestedCount,
        superInterestedCount,
        total
      });
      
      // Update Redux store with new token counts
      dispatch(updateUserTokens(interestedCount, superInterestedCount));
      
      alert(`Payment Successful! $${total} processed.\n\nYou received:\n• ${interestedCount} Interested tokens\n• ${superInterestedCount} Super Interested tokens\n\nYour sidebar will now show your updated token balance!`);
    }

    // TODO: Call API to update user tokens/chats on backend
    // await apiRequest({ method: 'POST', url: 'user/update-tokens', data: { ... } });

    // Reset counts and close modal
    setInterestedCount(0);
    setSuperInterestedCount(0);
    setALaCarteCount(0);
    setQueensBundleCount(0);
    onClose();
  };

  const handleIncrement = (type) => {
    if (isFemale) {
      if (type === 'aLaCarte') {
        setALaCarteCount(prev => prev + 1);
      } else if (type === 'queensBundle') {
        setQueensBundleCount(prev => prev + 1);
      }
    } else {
      if (type === 'interested') {
        setInterestedCount(prev => prev + 1);
      } else {
        setSuperInterestedCount(prev => prev + 1);
      }
    }
  };

  const handleDecrement = (type) => {
    if (isFemale) {
      if (type === 'aLaCarte') {
        setALaCarteCount(prev => Math.max(0, prev - 1));
      } else if (type === 'queensBundle') {
        setQueensBundleCount(prev => Math.max(0, prev - 1));
      }
    } else {
      if (type === 'interested') {
        setInterestedCount(prev => Math.max(0, prev - 1));
      } else {
        setSuperInterestedCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <Image src={close1} alt="close" width={24} height={24} />
        </CloseButton>

        {isFemale ? (
          <>
            {/* Women's Pricing: A La' Carte */}
            <PricingCard>
              <CardHeader>
                <TitleSection>
                  <div style={{ fontFamily: 'HipsterScriptW00-Regular, cursive, sans-serif', fontSize: '48px', color: '#ffffff', lineHeight: '1' }}>
                    A La' Carte
                  </div>
                </TitleSection>
                <ArrowIcon>
                  <Image src={arrow1} alt="arrow" width={85} height={135} />
                </ArrowIcon>
              </CardHeader>
              <CardSubtitle>Pay As You Go</CardSubtitle>
              <CardPrice>50 cents/ Per new chat</CardPrice>

              <CounterSection>
                <CounterButton onClick={() => handleDecrement('aLaCarte')}>−</CounterButton>
                <CounterValue>{aLaCarteCount}</CounterValue>
                <CounterButton onClick={() => handleIncrement('aLaCarte')}>+</CounterButton>
              </CounterSection>

              <CardDescription>
                <p>- Perfect for keep trying it out</p>
                <p>- Your credits stay active until used</p>
              </CardDescription>
            </PricingCard>

            {/* Women's Pricing: Queens Bundle */}
            <PricingCard highlighted>
              <CardHeader>
                <TitleSection>
                  <div style={{ fontFamily: 'HipsterScriptW00-Regular, cursive, sans-serif', fontSize: '48px', color: '#ffffff', lineHeight: '1' }}>
                    Queens Bundle
                  </div>
                </TitleSection>
                <ArrowIcon>
                  <Image src={arrow2} alt="arrow" width={85} height={135} />
                </ArrowIcon>
              </CardHeader>
              <CardSubtitle>
                <span style={{ marginRight: '4px' }}>⚡</span>
                Maximize Your Experience
              </CardSubtitle>
              <CardPrice>$25 for package</CardPrice>

              <CounterSection>
                <CounterButton onClick={() => handleDecrement('queensBundle')}>−</CounterButton>
                <CounterValue>{queensBundleCount > 0 ? queensBundleCount * QUEENS_BUNDLE_CHATS : 0}</CounterValue>
                <CounterButton onClick={() => handleIncrement('queensBundle')}>+</CounterButton>
              </CounterSection>

              <CardDescription>
                <p>- Best Value (25 Cents per chat)</p>
              </CardDescription>
            </PricingCard>
          </>
        ) : (
          <>
            {/* Men's Pricing: Interested */}
            <PricingCard>
              <CardHeader>
                <TitleSection>
                  <Image src={interestedIcon} alt="Interested" width={165} height={70} />
                </TitleSection>
                <ArrowIcon>
                  <Image src={arrow1} alt="arrow" width={85} height={135} />
                </ArrowIcon>
              </CardHeader>
              <CardSubtitle>Show You're Committed</CardSubtitle>
              <CardPrice>$2/message</CardPrice>

              <CounterSection>
                <CounterButton onClick={() => handleDecrement('interested')}>−</CounterButton>
                <CounterValue>{interestedCount}</CounterValue>
                <CounterButton onClick={() => handleIncrement('interested')}>+</CounterButton>
              </CounterSection>

              <CardDescription>
                <p>- Show you're a gentleman by committing to her date and covering the outing.</p>
                <p>- Standard visibility.</p>
              </CardDescription>
            </PricingCard>

            {/* Men's Pricing: Super Interested */}
            <PricingCard highlighted>
              <CardHeader>
                <TitleSection>
                  <Image src={superInterestedIcon} alt="Super Interested" width={165} height={70} />
                </TitleSection>
                <ArrowIcon>
                  <Image src={arrow2} alt="arrow" width={85} height={135} />
                </ArrowIcon>
              </CardHeader>
              <CardSubtitle>
                <span style={{ marginRight: '4px' }}>⚡</span>
                Supercharge Your Presence
              </CardSubtitle>
              <CardPrice>$4/message</CardPrice>

              <CounterSection>
                <CounterButton onClick={() => handleDecrement('superInterested')}>−</CounterButton>
                <CounterValue>{superInterestedCount}</CounterValue>
                <CounterButton onClick={() => handleIncrement('superInterested')}>+</CounterButton>
              </CounterSection>

              <CardDescription>
                <p>- Go VIP by investing in her aspirations and increasing your chance. You'll also cover her date outing.</p>
                <p>- 3x more responses. Priority visibility.</p>
              </CardDescription>
            </PricingCard>
          </>
        )}

        {/* Footer */}
        <MinPurchase>*Min purchase of ${minPurchase}</MinPurchase>
        <CheckoutButton
          disabled={!canCheckout}
          canCheckout={canCheckout}
          onClick={handleCheckout}
        >
          (${total.toFixed(2)}) Proceed to Checkout
        </CheckoutButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PricingMenuModal;

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
  align-items: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #000000;
  border-radius: 0;
  width: 100%;
  max-width: 420px;
  padding: 32px 16px 20px;
  position: relative;
  overflow: visible;

  @media (max-width: 768px) {
    max-width: 95vw;
    padding: 24px 12px 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  transition: transform 0.2s;
  opacity: 0.8;

  &:hover {
    transform: rotate(90deg);
    opacity: 1;
  }
`;

const PricingCard = styled.div`
  background: #000000;
  border: 2px solid ${props => props.highlighted ? '#F24462' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 24px;
  padding: 24px 20px 24px;
  margin-bottom: 16px;
  position: relative;
  box-shadow: ${props => props.highlighted ? '0 0 20px rgba(242, 68, 98, 0.2)' : 'none'};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.highlighted ? '#F24462' : 'rgba(255, 255, 255, 0.35)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  position: relative;
`;

const TitleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const ArrowIcon = styled.div`
  flex-shrink: 0;
  position: absolute;
  right: -8px;
  top: -12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CardSubtitle = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
  margin-top: 0px;
  letter-spacing: 0.3px;
`;

const CardPrice = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #AFABAB;
  margin-bottom: 20px;
`;

const CounterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 56px;
  margin-bottom: 20px;
  padding: 16px 0;
`;

const CounterButton = styled.button`
  background: transparent;
  border: none;
  color: #F24462;
  font-size: 40px;
  font-weight: 300;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  line-height: 1;

  &:hover {
    transform: scale(1.3);
    opacity: 0.8;
  }

  &:active {
    transform: scale(1.0);
  }
`;

const CounterValue = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 72px;
  font-weight: 300;
  color: #ffffff;
  min-width: 100px;
  text-align: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  line-height: 1;
  padding-bottom: 2px;
`;

const CardDescription = styled.div`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #AFABAB;
  line-height: 1.5;

  p {
    margin: 3px 0;
  }
`;

const MinPurchase = styled.div`
  text-align: center;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 11px;
  color: #AFABAB;
  margin: 20px 0 12px;
  letter-spacing: 0.3px;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: ${props => props.canCheckout
    ? 'linear-gradient(90deg, #F24462 0%, #E2466B 100%)'
    : '#3a3a3a'};
  color: ${props => props.canCheckout ? '#ffffff' : '#7a7a7a'};
  border: none;
  border-radius: 4px;
  padding: 16px 20px;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: ${props => props.canCheckout ? 'pointer' : 'not-allowed'};
  transition: all 0.3s;
  letter-spacing: 0.5px;

  &:hover {
    ${props => props.canCheckout && `
      background: linear-gradient(90deg, #E2466B 0%, #F24462 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(242, 68, 98, 0.4);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;
