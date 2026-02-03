import React from "react";

const CreateDateGateModal = ({
  isOpen,
  variant = "intro", // "intro" | "limit"
  onClose,
  onProceed,
  checked = false,
  onToggleChecked,
}) => {
  if (!isOpen) return null;

  return (
    <div className="create-date-gate-overlay" onClick={onClose}>
      <div
        className={`create-date-gate-card ${
          variant === "limit" ? "is-limit" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {variant === "intro" ? (
          <>
            <h2>Want offers to flood in fast?</h2>
            <p className="gate-subtext">
              Ladies who post a few tempting date options go on far more dates
              and give themselves way more chances to meet someone amazing.
            </p>
            <p className="gate-subtext">
              Create up to 4 dates and never get lost in the crowd. Each with
              its own mood, duration and price.
            </p>
            <label className="gate-checkbox">
              <input
                type="checkbox"
                checked={checked}
                onChange={onToggleChecked}
              />
              <span>Don't show me this again</span>
            </label>
            <button type="button" className="gate-cta" onClick={onProceed}>
              OK, GOT IT!
            </button>
          </>
        ) : (
          <>
            <h2>You've reached your limit.</h2>
            <p className="gate-subtext">
              You can have up to 4 dates posted in the gallery at a time. If you
              like, you can delete an existing date and create a new one.
            </p>
            <p className="gate-subtext">
              We'll unlock more dates soon!
            </p>
            <button type="button" className="gate-cta" onClick={onClose}>
              OK, GOT IT!
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateDateGateModal;
