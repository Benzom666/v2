import React from "react";

const DateLiveModal = ({ isOpen, onClose, checked, onToggleChecked }) => {
  if (!isOpen) return null;

  return (
    <div className="date-live-overlay" onClick={onClose}>
      <div
        className="date-live-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Success. You're live!</h2>
        <p>
          Our gentleman's profiles remain private until they message you. Our
          community attracts high-status men who value privacy.
        </p>
        <p>
          While you wait, explore other women's dates for style, pricing, and
          inspiration.
        </p>
        <label className="date-live-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggleChecked}
          />
          <span>Don't show me again</span>
        </label>
        <button type="button" className="date-live-cta" onClick={onClose}>
          OK, GOT IT!
        </button>
      </div>
    </div>
  );
};

export default DateLiveModal;
