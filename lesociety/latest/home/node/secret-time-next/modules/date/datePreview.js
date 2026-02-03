import React, { useState, useEffect } from "react";
import { reduxForm, reset, change } from "redux-form";
import { useSelector, useDispatch } from "react-redux";
import validate from "modules/auth/forms/validate/validate";
import Link from "next/link";
import { useRouter } from "next/router";
import UserCardDetail from "@/core/UserCardDetail";
import ConfirmDate from "./../../modules/date/confirmDate";
import { apiRequest } from "utils/Utilities";
import SkeletonDatesPreview from "../skeleton/Dates/SkeletonDatesPreview";
import CreateDateHeader from "@/core/CreateDateHeader";

const DatePreview = (props) => {
  const { handleSubmit, invalid, pristine, submitting, onClose } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state?.authReducer.user);
  const cityState = useSelector((state) => state?.form?.ChooseCity?.values);
  const dateSuggestion = useSelector(
    (state) => state?.form?.CreateStepOne?.values
  );
  const priceState = useSelector((state) => state?.form?.CreateStepTwo?.values);
  const timeState = useSelector(
    (state) => state?.form?.CreateStepThree?.values
  );
  const dateDescription = useSelector(
    (state) => state?.form?.CreateStepFour?.values
  );
  const selectedDateData = useSelector(
    (state) => state?.form?.CreateStepOne?.values
  );
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [eligibleImages, setEligibleImages] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      if (user?.images?.length > 0 && user?.images[0]) {
        setPageLoading(false);
      }
    }, 2000);
  }, []);

  const toggle = () => setConfirmPopup(!confirmPopup);

  useEffect(() => {
    const fetchUsedImages = async () => {
      try {
        if (!user?.user_name) {
          return;
        }
        const res = await apiRequest({
          url: "date",
          params: {
            user_name: user?.user_name,
            current_page: 1,
            per_page: 10000,
          },
        });
        const dates = res?.data?.data?.dates || [];
        const usedIndices = dates
          .filter((date) => date?.date_status === true)
          .map((date) =>
            typeof date?.image_index === "number" ? date.image_index : 0
          );
        const images = user?.images || [];
        let available = images
          .map((url, idx) => ({ url, idx }))
          .filter((img) => !usedIndices.includes(img.idx));
        if (!available.length && images.length) {
          available = images.map((url, idx) => ({ url, idx }));
        }
        setEligibleImages(available);
        const currentIndex =
          typeof dateSuggestion?.image_index === "number"
            ? dateSuggestion.image_index
            : available[0]?.idx;
        const initial =
          available.find((img) => img.idx === currentIndex) || available[0];
        if (initial) {
          dispatch(change("CreateStepOne", "image_index", initial.idx));
        }
      } catch (e) {
        console.log("Failed to load images", e);
      }
    };
    fetchUsedImages();
  }, [user?.user_name, user?.images]);

  const handleSwapImage = () => {
    if (eligibleImages.length < 2) {
      return;
    }
    const currentIndex =
      typeof dateSuggestion?.image_index === "number"
        ? dateSuggestion.image_index
        : eligibleImages[0]?.idx;
    const currentPos = eligibleImages.findIndex(
      (img) => img.idx === currentIndex
    );
    const nextPos =
      currentPos === -1
        ? 0
        : (currentPos + 1) % eligibleImages.length;
    const next = eligibleImages[nextPos];
    if (next) {
      dispatch(change("CreateStepOne", "image_index", next.idx));
      if (dateSuggestion?.dateId) {
        apiRequest({
          method: "POST",
          url: `/date/update`,
          data: {
            date_id: dateSuggestion?.dateId,
            image_index: next.idx,
          },
        }).catch((err) => {
          console.log("Failed to update image index", err);
        });
      }
    }
  };

  const previousPage = () => {
    router.asPath.includes("drafted")
      ? router.push("/user/user-list")
      : router.query?.new_edit
      ? props.setPage(3)
      : router.back();
  };

  const postDate = async () => {
    setLoader(true);
    const data = {
      date_status: true,
    };
    try {
      const res = await apiRequest({
        method: "POST",
        url: `/date/update-draft-status`,
        data: data,
      });
      setLoader(false);
      router.push(
        {
          pathname: "/user/user-list",
          query: {
            city: cityState?.enter_city?.name,
            country: cityState.enter_country?.value,
            posted: true,
            province: cityState?.enter_city?.province[0]?.short_code?.split(
              "-"
            )[1]
              ? cityState?.enter_city?.province[0]?.short_code?.split("-")[1]
              : cityState?.enter_city?.province[0]?.short_code,
          },
        },
        "/user/user-list"
      );
      dispatch(reset("ChooseCity"));
      dispatch(reset("CreateStepOne"));
      dispatch(reset("CreateStepTwo"));
      dispatch(reset("CreateStepThree"));
      dispatch(reset("CreateStepFour"));
    } catch (e) {
      setLoader(false);
    }
  };

  const updateDate = async () => {
    setLoader(true);
    const data = {
      user_name: user?.user_name,
      date_id: selectedDateData?.dateId,
      date_details: dateDescription?.date_description,
    };
    try {
      const res = await apiRequest({
        method: "POST",
        url: `/date/update`,
        data: data,
      });
      setLoader(false);
      router.push(
        {
          pathname: "/user/user-list",
          query: {
            city: cityState?.enter_city?.name,
            country: cityState.enter_country?.value,
            province: cityState?.enter_city?.province[0]?.short_code?.split(
              "-"
            )[1]
              ? cityState?.enter_city?.province[0]?.short_code?.split("-")[1]
              : cityState?.enter_city?.province[0]?.short_code,
          },
        },
        "/user/user-list"
      );
      dispatch(reset("ChooseCity"));
      dispatch(reset("CreateStepOne"));
      dispatch(reset("CreateStepTwo"));
      dispatch(reset("CreateStepThree"));
      dispatch(reset("CreateStepFour"));
    } catch (e) {
      setLoader(false);
    }
  };

  if (pageLoading) {
    return <SkeletonDatesPreview />;
  }

  return (
    <>
      {!confirmPopup ? (
        <>
          <CreateDateHeader
            activeStep={5}
            onBack={previousPage}
            onClose={toggle}
            showBack={true}
            showClose={true}
          />
          <div className="inner_container">
            <div className="create-date-intro">
              <h2>You're almost done!</h2>
              <div className="intro-subtitle">
                Take a moment to review your date.
              </div>
              <div className="intro-note">
                Your description can only be edited. Everything else is locked.
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="date-class-section choose-gender date-preview-card"
          >
            <div className="inner_container inner_container_Date_Preview_width">
              <UserCardDetail
                user={user}
                cityState={cityState}
                dateSuggestion={dateSuggestion}
                timeState={timeState}
                priceState={priceState}
                dateDescription={dateDescription}
                imageSrc={
                  eligibleImages.find(
                    (img) => img.idx === dateSuggestion?.image_index
                  )?.url
                }
                showSwap={eligibleImages.length >= 2}
                onSwap={handleSwapImage}
              />
              {!confirmPopup && (
                <div className="bottom-mobile register-bottom">
                  <div className="secret-input type-submit next-prev">
                    {!router?.query?.new_edit && (
                      <button type="button" className="edit next">
                        <Link href="/create-date/choose-city?edit=true">
                          <a>Edit</a>
                        </Link>
                      </button>
                    )}
                    <button
                      type="button"
                      className="next"
                      onClick={router?.query?.new_edit ? updateDate : postDate}
                    >
                      {loader ? (
                        <span className="spin-loader-button"></span>
                      ) : (
                        <>
                          <a className="forgot-passwrd">
                            {router?.query?.new_edit ? "Update Date" : "Post Date"}
                          </a>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </>
      ) : null}
      <ConfirmDate isOpen={confirmPopup} toggle={toggle} />
    </>
  );
};
export default reduxForm({
  form: "DatePreview",
  validate,
})(DatePreview);
