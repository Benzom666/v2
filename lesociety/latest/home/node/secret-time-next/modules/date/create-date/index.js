import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useWindowSize from "utils/useWindowSize";
import { CreateDateProvider, useCreateDate } from "./context/CreateDateContext";
import Step1ExperienceMobile from "./components/CreateDateMobile/Step1Experience";
import Step2CategoryMobile from "./components/CreateDateMobile/Step2Category";
import Step3DurationMobile from "./components/CreateDateMobile/Step3Duration";
import Step4DescriptionMobile from "./components/CreateDateMobile/Step4Description";
import Step5PreviewMobile from "./components/CreateDateMobile/Step5Preview";
import Step1ExperienceDesktop from "./components/CreateDateDesktop/Step1Experience";
import Step2CategoryDesktop from "./components/CreateDateDesktop/Step2Category";
import Step3DurationDesktop from "./components/CreateDateDesktop/Step3Duration";
import Step4DescriptionDesktop from "./components/CreateDateDesktop/Step4Description";
import Step5PreviewDesktop from "./components/CreateDateDesktop/Step5Preview";

/**
 * Internal component that uses the CreateDate context
 * Handles step routing and renders appropriate component
 */
const CreateDateFlow = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { currentStep, setCity, setUserInfo, setEditMode, goToStep } =
    useCreateDate();

  const cityState = useSelector((state) => state?.form?.ChooseCity?.values);
  const user = useSelector((state) => state?.authReducer?.user);
  const mobile = width < 768;

  // Initialize city and user in context
  useEffect(() => {
    if (cityState?.enter_city) {
      setCity(cityState);
    }
  }, [cityState, setCity]);

  useEffect(() => {
    if (user?.user_name) {
      setUserInfo(user);
    }
  }, [user, setUserInfo]);

  // Handle edit mode from URL params
  useEffect(() => {
    if (router.query.new_edit) {
      setEditMode(true, null);
      goToStep(3); // Go to description step for edit
    }
  }, [router.query, setEditMode, goToStep]);

  // Protect route - require city selection
  if (!cityState?.enter_city) {
    if (typeof window !== "undefined") {
      router.push("/create-date/choose-city");
      window.scrollTo(0, 0);
    }
    return null;
  }

  // Render appropriate step component based on current step and device type
  const renderStep = () => {
    if (mobile) {
      // Mobile components
      switch (currentStep) {
        case 0:
          return <Step1ExperienceMobile />;
        case 1:
          return <Step2CategoryMobile />;
        case 2:
          return <Step3DurationMobile />;
        case 3:
          return <Step4DescriptionMobile />;
        case 4:
          return <Step5PreviewMobile />;
        default:
          return <Step1ExperienceMobile />;
      }
    } else {
      // Desktop components
      switch (currentStep) {
        case 0:
          return <Step1ExperienceDesktop />;
        case 1:
          return <Step2CategoryDesktop />;
        case 2:
          return <Step3DurationDesktop />;
        case 3:
          return <Step4DescriptionDesktop />;
        case 4:
          return <Step5PreviewDesktop />;
        default:
          return <Step1ExperienceDesktop />;
      }
    }
  };

  return <>{renderStep()}</>;
};

/**
 * Main Create Date Component
 * Wraps the flow in the CreateDateProvider and handles initialization
 */
const CreateDate = (props) => {
  const router = useRouter();
  const cityState = useSelector((state) => state?.form?.ChooseCity?.values);
  const user = useSelector((state) => state?.authReducer?.user);

  // Get initial data from Redux form if editing
  const stepOneData = useSelector((state) => state?.form?.CreateStepOne?.values);
  const stepTwoData = useSelector((state) => state?.form?.CreateStepTwo?.values);
  const stepThreeData = useSelector(
    (state) => state?.form?.CreateStepThree?.values
  );
  const stepFourData = useSelector(
    (state) => state?.form?.CreateStepFour?.values
  );

  // Compile initial form data from Redux forms (for backward compatibility)
  const initialFormData = {
    search_type: stepOneData?.search_type || null,
    enter__category: stepTwoData?.enter__category || "",
    enter__aspiration: stepTwoData?.enter__aspiration || "",
    education: stepTwoData?.education || "",
    date_duration: stepThreeData?.date_duration || "",
    date_description: stepFourData?.date_description || "",
    image_index: stepOneData?.image_index || 0,
    dateId: stepOneData?.dateId || null,
  };

  return (
    <CreateDateProvider
      initialData={{
        ...initialFormData,
        cityState,
        user,
      }}
    >
      <CreateDateFlow {...props} />
    </CreateDateProvider>
  );
};

export default CreateDate;
