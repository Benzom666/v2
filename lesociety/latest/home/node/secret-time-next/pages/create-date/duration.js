import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { apiRequest } from "utils/Utilities";
import CreateDateHeader from "@/core/CreateDateHeader";
import { toast } from "react-toastify";

const DURATION_OPTIONS = [
  { label: "1 hour", value: "1 hour" },
  { label: "2 hours", value: "2 hours" },
  { label: "3 hours", value: "3 hours" },
  { label: "4 hours", value: "4 hours" },
  { label: "5 hours", value: "5 hours" },
  { label: "6 hours", value: "6 hours" },
  { label: "7 hours", value: "7 hours" },
  { label: "8+ hours", value: "8 hours" },
];

function CreateDuration() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.authReducer?.user);

  const [selectedDuration, setSelectedDuration] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    category = "",
    aspiration = "",
    price = ""
  } = router.query;

  // Prefill from query params
  React.useEffect(() => {
    if (category) setSelectedCategory(category);
    if (aspiration) setSelectedAspiration(aspiration);
    if (price) setSelectedPrice(price);
  }, [category, aspiration, price]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAspiration, setSelectedAspiration] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const handleNext = async () => {
    if (!selectedDuration) {
      toast.error("Please select a duration");
      return;
    }

    setIsSaving(true);
    try {
      // Save to Redux
      dispatch({
        type: "@@redux-form/INITIALIZE",
        meta: { form: "CreateStepThree" },
        payload: {
          date_duration: selectedDuration,
          education: selectedPrice,
        },
      });

      // Navigate to description page
      router.push("/create-date/description");
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
                activeStep={3}
                onBack={handleBack}
                onClose={() => router.push("/user/user-list")}
                showBack={true}
                showClose={true}
              />

              <div className="create-date-content">
                <div className="inner_container">
                  <div className="create-date-intro">
                    <h2>How long will this date take?</h2>
                    <div className="intro-subtitle">
                      Set the expected duration so he knows how much time to block
                      off for your special date.
                    </div>
                  </div>
                </div>

                <div className="date-class-section choose-gender">
                  <div className="inner_container desktop-experience-container">
                    <div
                      className="experience-grid desktop-experience-grid"
                      style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                    >
                      {DURATION_OPTIONS.map((option) => {
                        const isSelected = selectedDuration === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              console.log("Duration selected:", option.value);
                              setSelectedDuration(option.value);
                            }}
                            className={`price-card desktop-price-card ${
                              isSelected ? "is-selected" : ""
                            }`}
                            style={{
                              padding: "30px 20px",
                              backgroundColor: isSelected ? "#3a3a3a" : "#2a2a2a",
                              border: isSelected ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "12px",
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "600",
                              transition: "all 0.2s",
                              textAlign: "center"
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.target.style.backgroundColor = "#3a3a3a";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.target.style.backgroundColor = "#2a2a2a";
                              }
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="desktop-navigation">
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleNext}
                    disabled={!selectedDuration || isSaving}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: !selectedDuration ? "#666" : "#fff",
                      color: !selectedDuration ? "#999" : "#000",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: !selectedDuration ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    {isSaving ? (
                      <span className="spin-loader-button"></span>
                    ) : (
                      <>
                        Next <FiArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateDuration;
