import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CreateDateNewHeader from "@/core/CreateDateNewHeader";
import { toast } from "react-toastify";

function CreateDescription() {
  const router = useRouter();
  const [description, setDescription] = useState("");

  useEffect(() => {
    try {
      const data = localStorage.getItem("create_date_flow");
      if (data) {
        const savedData = JSON.parse(data);
        if (savedData.description) setDescription(savedData.description);
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }
  }, []);

  const handleNext = () => {
    if (!description.trim()) {
      toast.error("Please describe your date");
      return;
    }

    if (description.trim().length < 20) {
      toast.error("Please provide at least 20 characters");
      return;
    }

    try {
      const existingData = localStorage.getItem("create_date_flow");
      const parsedData = existingData ? JSON.parse(existingData) : {};
      const updatedData = {
        ...parsedData,
        description,
      };
      localStorage.setItem("create_date_flow", JSON.stringify(updatedData));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }

    router.push("/create-date/review");
  };

  return (
    <div className="create-date-page">
      <CreateDateNewHeader
        activeStep={4}
        onBack={() => router.push("/create-date/duration")}
        onClose={() => router.push("/user/user-list")}
      />

      <div className="create-date-content">
        <h1 className="page-title">Make him want this date.</h1>
        <p className="page-subtitle">
          Tell him why this night with you is unforgettable. Your vibe, your
          energy, what he can expect.
        </p>

        <div className="form-section">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="I love deep conversations over great wine... I'm playful, classy, and always up for an adventure. Expect laughter, real connection, and a night that feels effortless."
            maxLength={500}
            className="description-textarea"
          />
          <div className="character-count">
            {description.length}/500 characters
          </div>

          <div className="tips-section">
            <div className="tips-title">Pro tips:</div>
            <ul className="tips-list">
              <li>Keep it authentic and fun</li>
              <li>Be specific about the vibe</li>
              <li>Leave him wanting more</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bottom-button-container">
        <button
          className={`next-button ${!description.trim() ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={!description.trim()}
        >
          NEXT
        </button>
      </div>

      <style jsx>{`
        .create-date-page {
          min-height: 100vh;
          background: #000000;
          display: flex;
          flex-direction: column;
        }

        .create-date-content {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
          padding-bottom: 120px;
        }

        .page-title {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: #FFFFFF;
          text-align: center;
          margin: 0 0 12px 0;
        }

        .page-subtitle {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #CCCCCC;
          text-align: center;
          margin: 0 0 32px 0;
        }

        .form-section {
          background: transparent;
          border: none;
          padding: 0;
        }

        .description-textarea {
          width: 100%;
          min-height: 220px;
          padding: 20px;
          font-size: 15px;
          background: transparent;
          color: #FFFFFF;
          border: 1px solid #333333;
          border-radius: 16px;
          resize: vertical;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          line-height: 1.6;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .description-textarea:focus {
          outline: none;
          border-color: #FF3B81;
          box-shadow: 0 0 20px rgba(255, 59, 129, 0.15);
        }

        .description-textarea::placeholder {
          color: #666666;
        }

        .character-count {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 12px;
          color: #999999;
          text-align: right;
          margin-bottom: 24px;
        }

        .tips-section {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .tips-title {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 8px;
        }

        .tips-list {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          color: #AAAAAA;
          line-height: 1.8;
          margin: 0;
          padding-left: 20px;
        }

        .bottom-button-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: #000000;
          display: flex;
          justify-content: center;
        }

        .next-button {
          width: 100%;
          max-width: 420px;
          height: 52px;
          background: #FF3B81;
          border: none;
          border-radius: 12px;
          color: #FFFFFF;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .next-button:hover:not(.disabled) {
          opacity: 0.9;
        }

        .next-button.disabled {
          background: #1A1A1A;
          color: #666666;
          cursor: not-allowed;
        }

        @media (min-width: 768px) {
          .create-date-content {
            padding: 40px 32px;
            max-width: 600px;
            margin: 0 auto;
          }

          .page-title {
            font-size: 36px;
          }

          .page-subtitle {
            font-size: 18px;
            margin-bottom: 40px;
          }

          .form-section {
            padding: 0;
          }

          .bottom-button-container {
            padding: 24px 32px;
          }

          .next-button {
            height: 56px;
            font-size: 18px;
            max-width: 600px;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateDescription;
