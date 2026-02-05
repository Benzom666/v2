import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Inputs } from "core";
import { apiRequest } from "utils/Utilities";
import CreateDateHeader from "@/core/CreateDateHeader";
import { toast } from "react-toastify";

const PRICE_OPTIONS = [50, 75, 100, 150, 200, 250, 300, 400, 500];

function CreateStepTwo({ handleSubmit, pristine, submitting }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [aspirations, setAspirations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAspiration, setSelectedAspiration] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);

  const user = useSelector((state) => state?.authReducer?.user);

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

    // Save to Redux form state for next step
    dispatch({
      type: "@@redux-form/INITIALIZE",
      meta: { form: "CreateStepTwo" },
      payload: {
        enter__category: selectedCategory,
        enter__aspiration: selectedAspiration,
        education: selectedPrice,
      },
    });

    // Navigate to createStepThree (duration selection)
    router.push({
      pathname: "/create-date/duration",
      query: {
        category: selectedCategory,
        aspiration: selectedAspiration,
        price: selectedPrice
      }
    });
  };

  const handleBack = () => {
    router.push("/create-date/date-event");
  };

  return (
    <>
      <div className="inner-page">
        <div className="inner-part-page">
          <div className="auth-section create-date-wrap">
            <div className="create-date-shell create-date-desktop">
              <CreateDateHeader
                activeStep={2}
                onBack={handleBack}
                onClose={() => router.push("/user/user-list")}
                showBack={true}
                showClose={true}
              />

              <div className="create-date-content">
                <div className="inner_container">
                  <div className="create-date-intro">
                    <h2>Your aspiration. Your price.</h2>
                    <div className="intro-subtitle">
                      When a man chooses Super Interested, he's saying: I'll cover
                      the outing and financially support your aspiration to skip
                      straight to our first date - Fast.
                    </div>
                  </div>
                </div>

                <div className="date-class-section choose-gender">
                  <div className="inner_container desktop-category-container">
                    <div className="desktop-category-layout">
                      {/* Left side - Category & Aspiration */}
                      <div className="desktop-category-left">
                        <div className="mb-4">
                          <div className="aspiration__main__dropdown">
                            <label className="aspiration__label1">
                              1. Who do you aspire to be?
                            </label>
                            <label className="aspiration__label2">
                              Your selection will be locked for 30 days
                            </label>

                            {/* Category Selection - DROPDOWN */}
                            <select
                              value={selectedCategory || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                console.log("Category selected:", value);
                                setSelectedCategory(value);
                                setSelectedAspiration("");
                              }}
                              style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "16px",
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                cursor: "pointer"
                              }}
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
                                <label
                                  className="aspiration__label1"
                                  style={{ marginTop: "16px", display: "block", color: "#fff" }}
                                >
                                  Select Your Aspiration
                                </label>
                                <select
                                  value={selectedAspiration || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    console.log("Aspiration selected:", value);
                                    setSelectedAspiration(value);
                                  }}
                                  disabled={!selectedCategory}
                                  style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: "16px",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    cursor: selectedCategory ? "pointer" : "not-allowed"
                                  }}
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
                      </div>

                      {/* Right side - Price */}
                      <div className="desktop-category-right">
                        <div className="mb-4">
                          <label className="price__radio__label">
                            2. Set your suggested financial gift
                          </label>
                          <p className="price__radio__gentlemen">
                            He hands you the gift in person on the date to help
                            support your goals. Showing his commitment.
                          </p>
                          <div className="price-grid desktop-price-grid">
                            {PRICE_OPTIONS.map((price) => {
                              const isSelected = selectedPrice === price;
                              return (
                                <button
                                  type="button"
                                  key={price}
                                  className={`price-card desktop-price-card ${
                                    isSelected ? "is-selected" : ""
                                  }`}
                                  onClick={() => {
                                    console.log("Price clicked:", price);
                                    setSelectedPrice(price);
                                  }}
                                  style={{
                                    padding: "20px",
                                    backgroundColor: isSelected
                                      ? "#3a3a3a"
                                      : "#2a2a2a",
                                    border: isSelected
                                      ? "2px solid #fff"
                                      : "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    fontWeight: "bold"
                                  }}
                                >
                                  ${price}
                                </button>
                              );
                            })}
                          </div>
                          <p className="price__radio__gentlemen mt-3">
                            Pro tip: Women who post multiple dates at different
                            price points get 3-5x more Super Interested offers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="desktop-navigation">
                    <button
                      type="button"
                      className="btn-next"
                      onClick={handleNext}
                      disabled={!selectedPrice || !selectedAspiration}
                      style={{
                        padding: "12px 24px",
                        backgroundColor:
                          !selectedPrice || !selectedAspiration
                            ? "#666"
                            : "#fff",
                        color:
                          !selectedPrice || !selectedAspiration
                            ? "#999"
                            : "#000",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      Next <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .aspiration__label1 {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        .aspiration__label2 {
          display: block;
          font-size: 14px;
          color: #888;
          margin-bottom: 12px;
        }
        .price__radio__label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }
        .price__radio__gentlemen {
          font-size: 14px;
          color: #aaa;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}

export default CreateStepTwo;
