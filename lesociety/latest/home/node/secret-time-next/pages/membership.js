import React, { useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/core/withAuth";
import close1 from "../assets/close1.png";
import Image from "next/image";

function Membership() {
  const router = useRouter();
  const [interestedCount, setInterestedCount] = useState(0);
  const [superInterestedCount, setSuperInterestedCount] = useState(0);

  const interestedPrice = 2; // $2 per message
  const superInterestedPrice = 4; // $4 per message

  const totalPrice = (interestedCount * interestedPrice) + (superInterestedCount * superInterestedPrice);

  const handleClose = () => {
    router.back();
  };

  const handlePurchase = () => {
    if (totalPrice < 25) {
      alert("Minimum purchase of $25 required");
      return;
    }
    // TODO: Implement purchase logic
    console.log("Purchase:", { interestedCount, superInterestedCount, total: totalPrice });
  };

  return (
    <div className="membership-page">
      {/* Close Button */}
      <button className="close-btn" onClick={handleClose}>
        <Image src={close1} alt="Close" width={12} height={12} />
      </button>

      <div className="membership-container">
        {/* Interested Plan */}
        <div className="plan-card">
          <div className="plan-header">
            <div className="plan-title-section">
              <h2 className="plan-title">
                Interested
                <span className="plan-subtitle">Super</span>
              </h2>
              <div className="plan-info">
                <h3 className="plan-tagline">Show You're Committed</h3>
                <p className="plan-price">${interestedPrice}/message</p>
              </div>
            </div>
            <div className="plan-arrows">
              <img src="/images/sidebar/arrow-right.svg" alt="" className="arrow-icon" />
            </div>
          </div>

          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => setInterestedCount(Math.max(0, interestedCount - 1))}
            >
              −
            </button>
            <div className="qty-display">
              <span className="qty-number">{interestedCount}</span>
            </div>
            <button
              className="qty-btn"
              onClick={() => setInterestedCount(interestedCount + 1)}
            >
              +
            </button>
          </div>

          <div className="plan-features">
            <p className="features-title">Features:</p>
            <p className="feature-item">- Get a standard placement</p>
            <p className="feature-item">- Showing her you're a gentleman</p>
          </div>
        </div>

        {/* Super Interested Plan */}
        <div className="plan-card super-interested">
          <div className="plan-header">
            <div className="plan-title-section">
              <h2 className="plan-title">
                Interested
                <span className="plan-subtitle highlight">Super</span>
              </h2>
              <div className="plan-info">
                <h3 className="plan-tagline">
                  <img src="/images/sidebar/bolt-yellow.svg" alt="" className="bolt-icon" />
                  Supercharge Your Presence
                </h3>
                <p className="plan-price">${superInterestedPrice}/message</p>
              </div>
            </div>
            <div className="plan-arrows double-arrows">
              <img src="/images/sidebar/arrow-right.svg" alt="" className="arrow-icon" />
              <img src="/images/sidebar/arrow-right.svg" alt="" className="arrow-icon" />
            </div>
          </div>

          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => setSuperInterestedCount(Math.max(0, superInterestedCount - 1))}
            >
              −
            </button>
            <div className="qty-display">
              <span className="qty-number">{superInterestedCount}</span>
            </div>
            <button
              className="qty-btn"
              onClick={() => setSuperInterestedCount(superInterestedCount + 1)}
            >
              +
            </button>
          </div>

          <div className="plan-features">
            <p className="features-title">Features:</p>
            <p className="feature-item">
              - Priority on her feed. <span className="highlight-text">3x more responses</span>
            </p>
            <p className="feature-item">
              - Show her <span className="highlight-text">you're a man of means</span>
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <p className="disclaimer">*Min purchase of $25</p>
        <button className="cta-btn" onClick={handlePurchase}>
          CREATE NEW DATE
        </button>
      </div>
    </div>
  );
}

export default withAuth(Membership);
