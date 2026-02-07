import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const Icon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #F24462 0%, #F02D4E 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const Title = styled.h2`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
  line-height: 1.3;
`;

const Text = styled.p`
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #cccccc;
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 24px 0;
  cursor: pointer;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 14px;
  color: #aaaaaa;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #F24462 0%, #F02D4E 100%);
  border: none;
  border-radius: 12px;
  font-family: "Conv_Helvetica", "Helvetica", Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(242, 68, 98, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DateLiveModal = ({ isOpen, onClose, checked, onToggleChecked }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Icon>✓</Icon>
        <Title>Success. You're live!</Title>
        <Text>
          Our gentleman's profiles remain private until they message you. Our
          community attracts high-status men who value privacy.
        </Text>
        <Text>
          While you wait, explore other women's dates for style, pricing, and
          inspiration.
        </Text>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggleChecked}
          />
          <span>Don't show me again</span>
        </CheckboxLabel>
        <Button onClick={onClose}>
          OK, GOT IT!
        </Button>
      </Card>
    </Overlay>
  );
};

export default DateLiveModal;
