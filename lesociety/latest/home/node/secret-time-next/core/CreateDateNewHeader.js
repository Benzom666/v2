import React from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { useRouter } from "next/router";

const TABS = [
  "Location",
  "Experience",
  "Earnings",
  "Duration",
  "Description",
  "Preview",
];

function CreateDateNewHeader({ activeStep = 0, onBack, onClose }) {
  const router = useRouter();

  const getTabForRoute = () => {
    const pathname = router?.pathname || "";
    if (pathname.includes("choose-city")) return 0;
    if (pathname.includes("choose-date-type")) return 1;
    if (pathname.includes("date-event")) return 2;
    if (pathname.includes("duration")) return 3;
    if (pathname.includes("description")) return 4;
    if (pathname.includes("review")) return 5;
    return activeStep;
  };

  const currentTab = getTabForRoute();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/user/user-list");
    }
  };

  return (
    <>
      <div className="create-date-header">
        <div className="header-bar">
          <button className="header-btn" onClick={handleBack}>
            <FiArrowLeft size={16} color="#CCCCCC" />
          </button>
          <span className="header-title">CREATE NEW DATE</span>
          <button className="header-btn" onClick={handleClose}>
            <FiX size={16} color="#CCCCCC" />
          </button>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-wrapper">
            <svg 
              className="progress-bg-line" 
              viewBox="0 0 305 5" 
              preserveAspectRatio="none"
              style={{ width: '100%', height: '5px' }}
            >
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#979797" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#1712FF" stopOpacity="0.4"/>
                </linearGradient>
              </defs>
              <path d="M2.5 2.5L302.5 2.5" stroke="url(#bgGradient)" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <svg 
              className="progress-fill-line"
              viewBox="0 0 262 13" 
              preserveAspectRatio="none"
              style={{ 
                width: `${((currentTab + 1) / TABS.length) * 100}%`,
                height: '13px',
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            >
              <defs>
                <filter id="progressGlow" x="0" y="0" width="100%" height="200%" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur"/>
                </filter>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1712FF"/>
                  <stop offset="0.488683" stopColor="#F24462"/>
                  <stop offset="100%" stopColor="#FF007A"/>
                </linearGradient>
              </defs>
              <g filter="url(#progressGlow)">
                <path d="M6.5 6.5H254.522" stroke="url(#progressGradient)" strokeWidth="5" strokeLinecap="round"/>
              </g>
            </svg>
            <div
              className="progress-indicator"
              style={{
                left: `${((currentTab + 1) / TABS.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="tabs-container">
          {TABS.map((tab, index) => {
            const isActive = index === currentTab;
            return (
              <button
                key={tab}
                className={`tab ${isActive ? "tab-active" : ""}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .create-date-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #000000;
        }

        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 16px;
        }

        .header-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }

        .header-btn:hover {
          opacity: 0.7;
        }

        .header-title {
          font-size: 16px;
          font-weight: 600;
          color: #CCCCCC;
          letter-spacing: 1px;
        }

        .progress-bar-container {
          height: 13px;
          background: transparent;
          position: relative;
          padding: 0 20px;
          display: flex;
          align-items: center;
        }

        .progress-bar-wrapper {
          width: 100%;
          height: 13px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .progress-bg-line {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          transform: translateY(-50%);
          z-index: 0;
        }

        .progress-fill-line {
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-indicator {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 10px;
          background: #FFFFFF;
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          z-index: 2;
          border-radius: 2px;
        }

        .tabs-container {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tabs-container::-webkit-scrollbar {
          display: none;
        }

        .tab {
          flex: 1;
          padding: 14px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 400;
          color: #666666;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          white-space: nowrap;
        }

        .tab-active {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          border-bottom: 2px solid #FF3B81;
        }

        @media (max-width: 767px) {
          .tabs-container {
            font-size: 12px;
          }

          .tab {
            font-size: 12px !important;
            padding: 10px 6px !important;
          }
        }

        @media (min-width: 768px) {
          .header-bar {
            padding: 0 24px;
            height: 64px;
          }

          .header-title {
            font-size: 18px;
          }

          .tabs-container {
            padding: 0 24px;
          }
        }
      `}</style>
    </>
  );
}

export default CreateDateNewHeader;
