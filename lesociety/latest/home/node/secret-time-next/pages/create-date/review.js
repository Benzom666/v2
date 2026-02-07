import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CreateDateNewHeader from "@/core/CreateDateNewHeader";
import { apiRequest } from "utils/Utilities";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import UserCardDetail from "@/core/UserCardDetail";

const DATE_TYPE_LABELS = {
  MorningBeverage: "Brunch",
  EveningDate: "Evening Date",
  GetSporty: "Get Sporty",
  TakeClass: "Take A Class",
  WineDine: "Wine & Dine",
  BottlesDance: "Bottles & Dance",
};

function CreateReview() {
  const router = useRouter();
  const user = useSelector((state) => state?.authReducer?.user);
  const [dateData, setDateData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableImages, setAvailableImages] = useState([]);

  useEffect(() => {
    console.log("=== Page Load ===");
    console.log("User:", user);
    
    try {
      const data = localStorage.getItem("create_date_flow");
      if (data) {
        const savedData = JSON.parse(data);
        console.log("Date data:", savedData);
        setDateData(savedData);
      } else {
        toast.error("No date data found. Please start over.");
        router.push("/create-date/choose-city");
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
      router.push("/create-date/choose-city");
    }

    // Set available images count for swap button
    if (user?.images && Array.isArray(user.images) && user.images.length > 0) {
      console.log("User has", user.images.length, "images");
      setAvailableImages(user.images);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!dateData) {
      toast.error("Missing required information");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_name: user?.user_name || user?.username,
        country_code: user?.country_code || "+1",
        country: user?.country || "United States",
        date_type: dateData.selectedDateType || "MorningBeverage",
        category: dateData.selectedCategory,
        aspiration: dateData.selectedAspiration,
        price: dateData.selectedPrice,
        duration: dateData.selectedDuration,
        description: dateData.description,
        location: dateData.selectedCity || dateData.city || dateData.location,
        date_status: true,
      };
      
      console.log("=== Creating Date ===");
      console.log("User:", user);
      console.log("Payload:", payload);

      const response = await apiRequest({
        method: "POST",
        url: "date",
        data: payload,
        token: user?.token,
      });

      localStorage.removeItem("create_date_flow");

      router.push({
        pathname: "/create-date/success",
        query: {
          dateId: response.data?.data?._id,
        },
      });
    } catch (err) {
      console.error("Error creating date:", err);
      toast.error(
        err.response?.data?.message || "Failed to create date. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (step) => {
    const stepRoutes = {
      city: "/create-date/choose-city",
      dateType: "/create-date/choose-date-type",
      category: "/create-date/date-event",
      duration: "/create-date/duration",
      description: "/create-date/description",
    };
    const route = stepRoutes[step] || "/create-date/choose-city";
    router.push(route);
  };

  const handleSwapImage = () => {
    if (availableImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const getCurrentImage = () => {
    console.log("=== Image Debug ===");
    console.log("user?.images:", user?.images);
    console.log("availableImages:", availableImages);
    console.log("currentImageIndex:", currentImageIndex);
    
    // Match the working UserCardList pattern: user?.images?.[index]
    if (user?.images && Array.isArray(user.images) && user.images.length > 0) {
      const imageIndex = currentImageIndex < user.images.length ? currentImageIndex : 0;
      const imageUrl = user.images[imageIndex];
      console.log("Using user.images[" + imageIndex + "]:", imageUrl);
      return imageUrl;
    }
    
    console.log("No images found, will show placeholder");
    return null;
  };

  if (!dateData) {
    return (
      <div className="create-date-page">
        <div className="loading-container">
          <div className="spin-loader"></div>
          <p>Loading your date...</p>
        </div>
      </div>
    );
  }

  const dateTypeLabel =
    DATE_TYPE_LABELS[dateData.selectedDateType] || "Brunch";

  return (
    <>
      <div className="create-date-page">
        <CreateDateNewHeader
          activeStep={5}
          onBack={() => router.push("/create-date/description")}
          onClose={() => router.push("/user/user-list")}
        />

      <div className="create-date-content">
        <h1 className="page-title">You're almost done!</h1>
        <p className="page-subtitle">
          Take a moment to review your date.<br />
          Your description can only be edited. Everything else is locked.
        </p>

        <div className="preview-container">
          <UserCardDetail
            user={{
              user_name: user?.user_name || user?.name,
              age: user?.age,
              images: user?.images,
              aspirationName: dateData.selectedAspirationName
            }}
            cityState={{
              enter_city: {
                name: dateData.selectedCity?.split(",")?.[0] || "Toronto",
                province: [{
                  short_code: dateData.selectedCity?.split(",")?.[1]?.trim() || "ON"
                }]
              }
            }}
            dateSuggestion={{
              search_type: {
                label: dateTypeLabel,
                icon: <span>⭐</span>
              }
            }}
            timeState={{
              date_duration: dateData.selectedDuration
            }}
            priceState={{
              education: dateData.selectedPrice
            }}
            dateDescription={{
              date_description: dateData.description
            }}
            imageSrc={getCurrentImage()}
            showSwap={availableImages.length > 1}
            onSwap={handleSwapImage}
          />
        </div>

        <div className="edit-all-section">
          <button
            className="edit-all-btn"
            onClick={() => router.push("/create-date/description")}
          >
            <FiEdit2 size={16} style={{ marginRight: "8px" }} />
            Edit All Details
          </button>
        </div>

        <div className="bottom-button-container">
          <button
            className="create-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spin-loader-button"></span>
                Creating...
              </>
            ) : (
              "CREATE DATE"
            )}
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

        .date-card-preview {
          background: transparent;
          border: 1px solid #222222;
          border-radius: 16px;
          overflow: hidden;
          max-width: 500px;
          margin: 0 auto 32px;
        }

        .date-card-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
        }

        .swap-image-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          cursor: pointer;
          border: none;
          z-index: 10;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .swap-image-btn:hover {
          background: rgba(0, 0, 0, 0.85);
          transform: scale(1.05);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          font-weight: 600;
          color: #FF3B81;
          font-family: "Inter", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, sans-serif;
        }

        .price-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 200, 83, 0.95);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          padding: 6px 14px;
          border-radius: 6px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 16px;
          font-weight: 700;
        }

        .date-card-details {
          padding: 20px;
          background: #000000;
        }

        .card-header {
          margin-bottom: 20px;
        }

        .user-name-age {
          font-size: 22px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 8px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .name-text {
          color: #FFFFFF;
        }

        .age-text {
          color: #FF3B81;
        }

        .location-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #999999;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .category-icon-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid #333333;
          padding: 6px 12px;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 500;
        }

        .aspiration-box {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #222222;
          border-bottom: 1px solid #222222;
          margin-bottom: 20px;
        }

        .aspiration-title {
          font-size: 20px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 6px;
        }

        .aspiration-subtitle {
          font-size: 11px;
          font-weight: 700;
          color: #999999;
          letter-spacing: 1px;
        }

        .details-box {
          margin-bottom: 20px;
        }

        .details-title {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 10px;
        }

        .details-content {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .details-label {
          color: #888888;
        }

        .details-value {
          color: #FFFFFF;
          font-weight: 600;
        }

        .interested-box {
          margin-bottom: 20px;
        }

        .interested-title {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 8px;
        }

        .interested-text {
          font-size: 13px;
          color: #CCCCCC;
          line-height: 1.6;
        }

        .super-interested-box {
          display: flex;
          gap: 14px;
          margin-bottom: 20px;
          padding: 18px;
          background: rgba(255, 59, 129, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 59, 129, 0.15);
        }

        .star-icon {
          font-size: 28px;
          color: #FF3B81;
          line-height: 1;
          flex-shrink: 0;
        }

        .super-interested-content {
          flex: 1;
        }

        .super-interested-title {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 6px;
        }

        .super-interested-price {
          font-size: 13px;
          color: #CCCCCC;
          margin-bottom: 4px;
        }

        .super-interested-price strong {
          color: #FFFFFF;
          font-weight: 700;
          font-size: 14px;
        }

        .suggested-gift {
          font-size: 11px;
          color: #888888;
        }

        .description-box {
          font-size: 13px;
          color: #CCCCCC;
          line-height: 1.7;
        }

        .description-box p {
          margin: 0;
        }

        .date-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .date-title {
          margin: 0;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .edit-icon-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #FF3B81;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-icon-btn:hover {
          background: rgba(255, 59, 129, 0.2);
        }

        .date-card-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-icon {
          color: #888888;
          flex-shrink: 0;
        }

        .info-text {
          flex: 1;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-value {
          color: #CCCCCC;
        }

        .edit-link {
          background: none;
          border: none;
          color: #FF3B81;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        .date-card-description {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }

        .date-card-description p {
          margin: 0;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          color: #CCCCCC;
          line-height: 1.5;
        }

        .edit-all-section {
          text-align: center;
          margin: 0 16px;
        }

        .edit-all-btn {
          background: transparent;
          border: 1px solid #FF3B81;
          color: #FF3B81;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }

        .edit-all-btn:hover {
          background: rgba(255, 59, 129, 0.1);
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

        .create-button {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .create-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .create-button:disabled {
          background: #1A1A1A;
          color: #666666;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: #CCCCCC;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        @media (max-width: 767px) {
          .date-card-preview {
            border-radius: 12px;
          }

          .price-badge {
            font-size: 14px;
            padding: 6px 12px;
          }

          .date-card-details {
            padding: 16px;
          }

          .date-title {
            font-size: 18px;
          }
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
            margin-bottom: 40px;
          }

          .date-card-preview {
            max-width: 600px;
          }

          .date-card-details {
            padding: 24px;
          }

          .date-title {
            font-size: 24px;
          }

          .bottom-button-container {
            padding: 24px 32px;
          }

          .create-button {
            height: 56px;
            font-size: 18px;
            max-width: 400px;
          }
        }
        `}</style>
      </div>
    </div>
    </>
  );
}

export default CreateReview;
