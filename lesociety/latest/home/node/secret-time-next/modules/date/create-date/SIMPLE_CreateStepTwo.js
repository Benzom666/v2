import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CreateDateNewHeader from "@/core/CreateDateNewHeader";
import { apiRequest } from "utils/Utilities";
import { toast } from "react-toastify";

const PRICE_OPTIONS = [80, 100, 150, 200, 300, 400, 500, 750, 1000];

const STORAGE_KEY = "create_date_flow";

const saveToLocalStorage = (data) => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const parsedData = existingData ? JSON.parse(existingData) : {};
    const updatedData = { ...parsedData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
};

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error loading from localStorage:", err);
    return null;
  }
};

function CreateStepTwo() {
  const router = useRouter();
  const user = useSelector((state) => state?.authReducer?.user);

  const [categories, setCategories] = useState([]);
  const [aspirations, setAspirations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAspiration, setSelectedAspiration] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);

  // Load saved data on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      if (saved.selectedCategory) {
        setSelectedCategory(saved.selectedCategory);
        // Load aspirations for the saved category
        const fetchAspirations = async () => {
          try {
            const res = await apiRequest({
              method: "GET",
              url: `aspirations?category_id=${saved.selectedCategory}`,
              token: user?.token,
            });

            const asps = res.data?.data?.map((asp) => ({
              label: asp?.name,
              value: asp?._id,
            })) || [];
            setAspirations(asps);

            if (saved.selectedAspiration) {
              setSelectedAspiration(saved.selectedAspiration);
            }
          } catch (err) {
            console.error("Failed to fetch aspirations:", err);
          }
        };

        fetchAspirations();
      }
      if (saved.selectedPrice) {
        setSelectedPrice(saved.selectedPrice);
      }
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest({
          method: "GET",
          url: `categories`,
          token: user?.token,
        });

        const cats = res.data?.data?.map((cat) => ({
          label: cat?.name,
          value: cat?._id,
        })) || [];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch aspirations when category changes
  useEffect(() => {
    const fetchAspirations = async () => {
      if (selectedCategory) {
        try {
          const res = await apiRequest({
            method: "GET",
            url: `aspirations?category_id=${selectedCategory}`,
            token: user?.token,
          });

          const asps = res.data?.data?.map((asp) => ({
            label: asp?.name,
            value: asp?._id,
          })) || [];
          setAspirations(asps);
        } catch (err) {
          console.error("Failed to fetch aspirations:", err);
        }
      } else {
        setAspirations([]);
      }
    };

    fetchAspirations();
  }, [selectedCategory, user?.token]);

  const handleNext = () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!selectedAspiration) {
      toast.error("Please select an aspiration");
      return;
    }
    if (!selectedPrice) {
      toast.error("Please select a price");
      return;
    }

    saveToLocalStorage({
      selectedCategory,
      selectedAspiration,
      selectedPrice,
    });

    router.push("/create-date/duration");
  };

  return (
    <div className="create-date-page">
      <CreateDateNewHeader
        activeStep={2}
        onBack={() => router.push("/create-date/choose-date-type")}
        onClose={() => router.push("/user/user-list")}
      />

      <div className="create-date-content">
        <h1 className="page-title">Your aspiration. Your price.</h1>
        <p className="page-subtitle">
          When a man chooses <strong>Super Interested</strong>, he's saying: I'll cover the outing and financially support your aspiration to skip straight to our first date - Fast.
        </p>

        <div className="two-column-layout">
          {/* Left Column - Category & Aspiration */}
          <div className="left-column">
            <div className="form-section">
              <label className="section-label">
                1. Who do you aspire to be?
              </label>
              <label className="section-sublabel">
                Your selection will be locked for 30 days
              </label>

              {/* Category Selection - DROPDOWN */}
              <select
                value={selectedCategory || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCategory(value);
                  setSelectedAspiration("");
                }}
                className="custom-select"
              >
                <option value="">Select A Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Aspiration Selection - DROPDOWN */}
              {selectedCategory && (
                <>
                  <label className="section-label secondary">
                    Select Your Aspiration
                  </label>
                  <select
                    value={selectedAspiration || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedAspiration(value);
                    }}
                    disabled={!selectedCategory}
                    className="custom-select"
                  >
                    <option value="">Select Your Aspiration</option>
                    {aspirations.map((asp) => (
                      <option key={asp.value} value={asp.value}>
                        {asp.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Price */}
          <div className="right-column">
            <div className="form-section">
              <label className="section-label">
                2. Set your suggested financial gift
              </label>
              <p className="section-description">
                He hands you the gift in person on the date to help support
                your goals. Showing his commitment.
              </p>
              <div className="price-grid">
                {PRICE_OPTIONS.map((price) => {
                  const isSelected = selectedPrice === price;
                  return (
                    <button
                      type="button"
                      key={price}
                      className={`price-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedPrice(price)}
                    >
                      ${price}
                    </button>
                  );
                })}
              </div>
              <p className="pro-tip">
                Pro tip: Women who post multiple dates at different price
                points get 3-5x more Super Interested offers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-button-container">
        <button
          className={`next-button ${
            !selectedPrice || !selectedAspiration ? "disabled" : ""
          }`}
          onClick={handleNext}
          disabled={!selectedPrice || !selectedAspiration}
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
          font-size: 20px;
          font-weight: 600;
          color: #FFFFFF;
          text-align: center;
          margin: 0 0 12px 0;
        }

        .page-subtitle {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #CCCCCC;
          text-align: center;
          margin: 0 auto 32px;
          max-width: 500px;
          line-height: 1.5;
        }

        .page-subtitle strong {
          color: #FFFFFF;
          font-weight: 600;
        }

        .two-column-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .left-column,
        .right-column {
          flex: 1;
        }

        .form-section {
          background: transparent;
          border: none;
          padding: 0;
        }

        .section-label {
          display: block;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 6px;
        }

        .section-label.secondary {
          margin-top: 16px;
        }

        .section-sublabel {
          display: block;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          margin-bottom: 16px;
        }

        .section-description {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #CCCCCC;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .custom-select {
          width: 100%;
          padding: 14px 16px;
          font-size: 16px;
          background: #000000;
          color: #FFFFFF;
          border: 1px solid #333333;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 12px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        .custom-select:focus {
          outline: none;
          border-color: #FF3B81;
        }

        .custom-select option {
          background: #000000;
          color: #FFFFFF;
        }

        .price-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .price-card {
          background: transparent;
          border: 1px solid #333333;
          border-radius: 10px;
          padding: 18px 12px;
          color: #FFFFFF;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .price-card:hover {
          border-color: #FF3B81;
          transform: translateY(-2px);
        }

        .price-card.selected {
          background: #FF3B81;
          border: 2px solid #FF3B81;
          color: #FFFFFF;
        }

        .pro-tip {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          line-height: 1.5;
          margin: 16px 0 0 0;
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
          height: 48px;
          background: #FF3B81;
          border: none;
          border-radius: 8px;
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
          background: #333333;
          color: #666666;
          cursor: not-allowed;
        }

        @media (min-width: 768px) {
          .create-date-content {
            padding: 40px 32px;
            max-width: 900px;
            margin: 0 auto;
          }

          .page-title {
            font-size: 28px;
            margin-bottom: 40px;
          }

          .two-column-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .form-section {
            padding: 24px;
          }

          .price-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .bottom-button-container {
            padding: 24px 32px;
          }

          .next-button {
            height: 56px;
            font-size: 18px;
            max-width: 900px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateStepTwo;
