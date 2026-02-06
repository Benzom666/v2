import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CreateDateNewHeader from "@/core/CreateDateNewHeader";
import Image from "next/image";
import BrunchImg from "assets/img/Brunch Date.png";
import EveningImg from "assets/img/Evening Date.png";
import SportyImg from "assets/img/Get Sporty.png";
import ClassImg from "assets/img/Take a class.png";
import WineImg from "assets/img/Wine & Dine.png";
import BottlesImg from "assets/img/Bottles & Dance.png";

const DATE_TYPES = [
  {
    id: "MorningBeverage",
    label: "Brunch",
    description: "Perfect when you're free mornings to early afternoon",
    time: "10 AM - 2 PM",
    category: "standard_class_date",
    badge: "Budget",
    image: BrunchImg,
  },
  {
    id: "EveningDate",
    label: "Evening Date",
    description: "Perfect when you're evening and nights at open",
    time: "6 PM - 10 PM",
    category: "standard_class_date",
    badge: "Budget",
    image: EveningImg,
  },
  {
    id: "GetSporty",
    label: "Get Sporty",
    description: "Adventure dates with a playful twist - mini-golf, ice skating, kayaking, anything real fun. Get thrilling, anything real thrilling or fun",
    time: "Flexible",
    category: "middle_class_dates",
    badge: "Mid",
    image: SportyImg,
  },
  {
    id: "TakeClass",
    label: "Take A Class",
    description: "Enjoy couples cooking class, pilates class lessons, painting, pottery, or anything creative where you'll learn together",
    time: "Flexible",
    category: "middle_class_dates",
    badge: "Mid",
    image: ClassImg,
  },
  {
    id: "WineDine",
    label: "Wine & Dine",
    description: "Indulge in fine dining, meaningful evening at top restaurants, perfect pairing, and pure indulgence",
    time: "7 PM - Late",
    category: "middle_class_dates",
    badge: "Lux",
    image: WineImg,
  },
  {
    id: "BottlesDance",
    label: "Bottles & Dance",
    description: "VIP tables with bottle lounges or clubs around - VIP style",
    time: "9 PM - Late",
    category: "executive_class_dates",
    badge: "Lux",
    image: BottlesImg,
  },
];

function ChooseDateType() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("create_date_flow");
      if (data) {
        const savedData = JSON.parse(data);
        if (savedData.selectedDateType) {
          setSelectedType(savedData.selectedDateType);
        }
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }
  }, []);

  const handleSelect = (typeId) => {
    setSelectedType(typeId);
    try {
      const existingData = localStorage.getItem("create_date_flow");
      const parsedData = existingData ? JSON.parse(existingData) : {};
      const updatedData = {
        ...parsedData,
        selectedDateType: typeId,
      };
      localStorage.setItem("create_date_flow", JSON.stringify(updatedData));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  const handleNext = () => {
    if (!selectedType) return;
    router.push("/create-date/date-event");
  };

  return (
    <div className="create-date-page">
      <CreateDateNewHeader
        activeStep={1}
        onBack={() => router.push("/create-date/choose-city")}
        onClose={() => router.push("/user/user-list")}
      />

      <div className="create-date-content">
        <h1 className="page-title">Choose your date</h1>
        <p className="page-subtitle">
          Select the type of date you want to create
        </p>

        <div className="date-type-grid">
          {DATE_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                className={`date-type-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(type.id)}
              >
                <div className="card-image-wrapper">
                  {type.badge && <div className="price-badge">{type.badge}</div>}
                  <Image
                    src={type.image}
                    alt={type.label}
                    width={400}
                    height={250}
                    className="card-image"
                  />
                  {isSelected && (
                    <div className="selected-badge">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="10" fill="#FF3B81" />
                        <path
                          d="M8 12L11 15L16 9"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <div className="card-label">{type.label}</div>
                  <div className="card-description">{type.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bottom-button-container">
        <button
          className={`next-button ${!selectedType ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={!selectedType}
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
          font-size: 22px;
          font-weight: 600;
          color: #FFFFFF;
          text-align: center;
          margin: 0 0 12px 0;
        }

        .page-subtitle {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #CCCCCC;
          text-align: center;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .date-type-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 100px;
        }

        .date-type-card {
          background: transparent;
          border: 2px solid transparent;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .date-type-card:hover {
          border-color: #333333;
        }

        .date-type-card.selected {
          border: 2px solid #FF3B81;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #0A0A0A;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .price-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 2;
          backdrop-filter: blur(8px);
        }

        .selected-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }

        .card-content {
          padding: 12px;
          text-align: left;
        }

        .card-label {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .card-description {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #888888;
          line-height: 1.4;
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
          align-items: center;
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
          padding: 0 32px;
        }

        .next-button:hover:not(.disabled) {
          opacity: 0.9;
        }

        .next-button.disabled {
          background: #1A1A1A;
          color: #666666;
          cursor: not-allowed;
        }

        @media (max-width: 767px) {
          .date-type-grid {
            gap: 10px;
          }

          .card-image-wrapper {
            aspect-ratio: 16 / 10;
          }

          .card-content {
            padding: 10px;
          }

          .card-label {
            font-size: 14px;
          }

          .card-description {
            font-size: 11px;
          }
        }

        @media (min-width: 768px) {
          .create-date-content {
            padding: 40px 32px;
            max-width: 900px;
            margin: 0 auto;
          }

          .page-title {
            font-size: 36px;
          }

          .page-subtitle {
            font-size: 18px;
            margin-bottom: 40px;
          }

          .date-type-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .card-image-wrapper {
            aspect-ratio: 16 / 10;
          }

          .card-content {
            padding: 16px;
          }

          .card-label {
            font-size: 16px;
          }

          .card-description {
            font-size: 13px;
          }

          .bottom-button-container {
            padding: 24px 32px;
          }

          .next-button {
            height: 56px;
            font-size: 18px;
            max-width: 400px;
          }
        }

        @media (min-width: 1024px) {
          .date-type-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChooseDateType;
