import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FiMapPin, FiX } from "react-icons/fi";
import CreateDateNewHeader from "@/core/CreateDateNewHeader";
import { fetchRealLocation } from "@/modules/auth/forms/steps/validateRealTime";

function ChooseCity() {
  const router = useRouter();
  const user = useSelector((state) => state?.authReducer?.user);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const FALLBACK_CITIES = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "San Francisco, CA",
    "Seattle, WA",
    "Denver, CO",
    "Washington, DC",
    "Boston, MA",
    "Toronto, ON",
    "Vancouver, BC",
  ];

  useEffect(() => {
    try {
      const data = localStorage.getItem("create_date_flow");
      if (data) {
        const savedData = JSON.parse(data);
        if (savedData.city) {
          setCity(savedData.city);
        }
        if (savedData.cityData) {
          setSelectedCity(savedData.cityData);
        }
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setSelectedCity(null);

    if (value.length >= 2) {
      setLoading(true);
      const filteredFallback = FALLBACK_CITIES.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      if (filteredFallback.length) {
        setSuggestions(filteredFallback.map((c) => ({ label: c, name: c })));
      }
      fetchRealLocation(value, undefined, (places) => {
        setSuggestions(places || []);
        setShowSuggestions(true);
        setLoading(false);
      });
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (cityOption) => {
    const displayLabel = cityOption?.label || cityOption?.name || "";
    setCity(displayLabel);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedCity(cityOption);

    try {
      const existingData = localStorage.getItem("create_date_flow");
      const parsedData = existingData ? JSON.parse(existingData) : {};
      const updatedData = {
        ...parsedData,
        city: displayLabel,
        cityData: cityOption,
      };
      localStorage.setItem("create_date_flow", JSON.stringify(updatedData));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  const handleClear = () => {
    setCity("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleNext = () => {
    if (!city.trim()) {
      alert("Please enter a city");
      return;
    }
    if (!selectedCity) {
      alert("Please select a city from the suggestions");
      return;
    }
    router.push("/create-date/choose-date-type");
  };

  return (
    <div className="create-date-page">
      <CreateDateNewHeader
        activeStep={0}
        onBack={() => router.push("/user/user-list")}
        onClose={() => router.push("/user/user-list")}
      />

      <div className="create-date-content">
        <h1 className="page-title">Where does your adventure start?</h1>
        <p className="page-subtitle">Pick your city.</p>
        <p className="page-note">
          Want to be discoverable in multiple cities? Just create a separate
          date for each one.
        </p>

        <div className="input-section">
          <div className="input-wrapper">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter your city"
              className="city-input"
              autoComplete="off"
            />
            {city && (
              <button
                className="clear-btn"
                onClick={handleClear}
                type="button"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectCity(suggestion)}
                  type="button"
                >
                  <FiMapPin size={16} />
                  {suggestion?.label || suggestion?.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-button-container">
        <button
          className={`next-button ${!selectedCity ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={!selectedCity}
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
          margin: 0 0 16px 0;
        }

        .page-note {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #888888;
          text-align: center;
          line-height: 1.5;
          margin: 0 0 48px 0;
          padding: 0 16px;
        }

        .input-section {
          max-width: 500px;
          margin: 0 auto;
          position: relative;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #FFFFFF;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .city-input {
          width: 100%;
          padding: 18px 54px 18px 52px;
          font-size: 16px;
          background: transparent;
          color: #FFFFFF;
          border: 1px solid #333333;
          border-radius: 12px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          transition: all 0.3s ease;
        }

        .city-input:focus {
          outline: none;
          border-color: #FF3B81;
          box-shadow: 0 0 0 1px #FF3B81;
        }

        .city-input::placeholder {
          color: #666666;
        }

        .clear-btn {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #888888;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          color: #FFFFFF;
        }

        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #0A0A0A;
          border: 1px solid #222222;
          border-radius: 12px;
          max-height: 250px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
        }

        .suggestion-item {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1A1A1A;
          color: #CCCCCC;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          transition: all 0.2s ease;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover {
          background: #111111;
          color: #FFFFFF;
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

        @media (min-width: 768px) {
          .create-date-content {
            padding: 40px 32px;
          }

          .page-title {
            font-size: 36px;
          }

          .page-subtitle {
            font-size: 18px;
          }

          .page-note {
            font-size: 15px;
            padding: 0;
          }

          .city-input {
            padding: 20px 50px 20px 50px;
            font-size: 17px;
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
      `}</style>
    </div>
  );
}

export default ChooseCity;
