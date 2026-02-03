import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to manage paywall display logic
 * @returns {Object} Paywall state and control functions
 */
export const usePaywall = () => {
  const [paywallConfig, setPaywallConfig] = useState({
    isOpen: false,
    type: null,
    expiresIn: 48,
    userName: ''
  });

  const user = useSelector((state) => state.authReducer.user);
  const chatTokens = user?.chat_tokens || 0;
  const interestedTokens = user?.interested_tokens || 0;
  const superInterestedTokens = user?.super_interested_tokens || 0;
  const isFemale = user?.gender === 'female';
  const isMale = user?.gender === 'male';

  /**
   * Show paywall for men when viewing first date profiles
   */
  const showMenFirstDatePaywall = (userName = 'Someone', expiresIn = 48) => {
    if (!isMale) return;
    
    // Only show if user has no tokens
    if (interestedTokens === 0 && superInterestedTokens === 0) {
      setPaywallConfig({
        isOpen: true,
        type: 'men_first_date',
        expiresIn,
        userName
      });
    }
  };

  /**
   * Show paywall for ladies when they run out of chats
   */
  const showLadiesChatPaywall = (expiresIn = 32) => {
    if (!isFemale) return;
    
    // Only show if user has no chat tokens
    if (chatTokens === 0) {
      setPaywallConfig({
        isOpen: true,
        type: 'ladies_chat',
        expiresIn,
        userName: ''
      });
    }
  };

  /**
   * Close the paywall
   */
  const closePaywall = () => {
    setPaywallConfig({
      isOpen: false,
      type: null,
      expiresIn: 48,
      userName: ''
    });
  };

  /**
   * Check if user should see paywall automatically
   */
  const shouldShowPaywall = () => {
    if (isMale && interestedTokens === 0 && superInterestedTokens === 0) {
      return true;
    }
    if (isFemale && chatTokens === 0) {
      return true;
    }
    return false;
  };

  return {
    paywallConfig,
    showMenFirstDatePaywall,
    showLadiesChatPaywall,
    closePaywall,
    shouldShowPaywall
  };
};
