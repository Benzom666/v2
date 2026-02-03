import React, { useState, useEffect } from "react";
import { Field, reduxForm, reset, change, initialize } from "redux-form";
import validate from "modules/auth/forms/validate/validate";
import { FiArrowRight } from "react-icons/fi";
import Footer from "core/footer";
import { Inputs } from "core";
import Link from "next/link";
import {
  fetchLocation,
  fetchLiveLocation,
  fetchRealLocation,
} from "../../modules/auth/forms/steps/validateRealTime";
import { countriesCode, apiRequest, dateCategory } from "../../utils/Utilities";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDate from "./../../modules/date/confirmDate";
import withAuth from "../../core/withAuth";
import router from "next/router";
import { components } from "react-select";
import Loader from "@/modules/Loader/Loader";
import { logout } from "@/modules/auth/authActions";
import CreateDateHeader from "@/core/CreateDateHeader";

const ChooseCity = (props) => {
  const [locationOptions, setLocation] = useState([]);
  const [places, setPlaces] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingLive, setLoadingLive] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [draftDateLoading, setDraftDateLoading] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form.ChooseCity?.values);
  const user = useSelector((state) => state.authReducer.user);

  const handleChange = async (value, inputAction) => {
    if (inputAction.action === "input-change") {
      setInputValue(value);
      fetchRealLocation(
        value,
        countriesCode[state?.enter_country?.value] ||
          countriesCode[state?.enter_country?.label],
        setPlaces
      );
    }
  };

  const toggle = () => setConfirmPopup(!confirmPopup);

  const fetchDraftedDate = async () => {
    setDraftDateLoading(true);
    try {
      //debugger
      const res = await apiRequest({
        url: "date",
        params: {
          user_name: user?.user_name,
          current_page: 1,
          per_page: 10000,
        },
      });

      if (res?.data?.data?.length === 0) {
        setDraftDateLoading(false);
        // dispatch(initialize("ChooseCity", ""));
        dispatch(initialize("CreateStepOne", ""));
        dispatch(initialize("CreateStepTwo", ""));
        dispatch(initialize("CreateStepThree", ""));
        dispatch(initialize("CreateStepFour", ""));
      }

      if (res.data.data?.dates) {
        const draftedDate = res.data.data?.dates.find(
          (item) => item?.date_status === false
        );
        if (!draftedDate) {
          setDraftDateLoading(false);
          // dispatch(initialize("ChooseCity", ""));
          dispatch(initialize("CreateStepOne", ""));
          dispatch(initialize("CreateStepTwo", ""));
          dispatch(initialize("CreateStepThree", ""));
          dispatch(initialize("CreateStepFour", ""));
        }
        if (draftedDate) {
          const category = dateCategory.find(
            (item) =>
              item?.label === draftedDate?.standard_class_date ||
              item?.label === draftedDate?.middle_class_dates ||
              item?.label === draftedDate?.executive_class_dates
          );
          const country = Object.keys(countriesCode).find(
            (key) =>
              countriesCode[key]?.toLowerCase() ===
              draftedDate.country_code?.toLowerCase()
          );

          dispatch(
            initialize("ChooseCity", {
              enter_country: {
                label: country,
                value: draftedDate.country_code,
              },
              enter_city: {
                name: draftedDate?.location,
                country: [
                  {
                    short_code: draftedDate.country_code,
                    text: country,
                  },
                ],
                label: draftedDate?.location + ", " + draftedDate?.province,
                province: [
                  { short_code: draftedDate?.province?.toUpperCase() },
                ],
              },
            })
          );
          dispatch(
            initialize("CreateStepOne", {
              search_type: category,
              image_index: draftedDate?.image_index ?? 0,
            })
          );
          dispatch(
            initialize("CreateStepTwo", {
              education: draftedDate?.price,
              enter__category: user?.categatoryId,
              enter__aspiration: user?.aspirationId,
            })
          );
          dispatch(
            initialize("CreateStepThree", {
              education: draftedDate?.date_length,
            })
          );
          dispatch(
            initialize("CreateStepFour", {
              date_description: draftedDate?.date_details,
            })
          );
          setDraftDateLoading(false);
          router.push("/create-date/date-event?drafted=true");
        }
      }
    } catch (err) {
      console.log(err);
      setDraftDateLoading(false);
      // dispatch(initialize("ChooseCity", ""));
      dispatch(initialize("CreateStepOne", ""));
      dispatch(initialize("CreateStepTwo", ""));
      dispatch(initialize("CreateStepThree", ""));
      dispatch(initialize("CreateStepFour", ""));
      if (
        err?.response?.status === 401 &&
        err?.response?.data?.message === "Failed to authenticate token!"
      ) {
        setTimeout(() => {
          logout(router, dispatch);
        }, 100);
      }
      return err;
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const location = await fetchLocation();
      if (location) {
        const locationOption = location
          ?.map(
            (item) =>
              item.isAvailable === 1 && {
                label: item.name,
                value: countriesCode[item.name],
              }
          )
          ?.filter((item) => item);
        setLocation(locationOption);
      }
    };
    fetch();
    if (user?.country && user?.location) {
      const data = {
        enter_country: {
          label: user?.country,
          value: countriesCode[user?.country],
        },
        enter_city: {
          name: user?.location,
          country: user?.country,
          label: user?.location + ", " + user?.province?.toUpperCase(),
          province: [{ short_code: user?.province?.toUpperCase() }],
        },
      };
      props.initialize(data);
    }
    if (!router?.query.edit) {
      fetchDraftedDate();
    }
  }, []);

  const handleIcon = () => {
    setLoadingLive(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (
          position.coords.latitude !== undefined &&
          position.coords.longitude !== undefined
        ) {
          const location = await fetchLiveLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          const data = {
            enter_country: {
              label: location[0].country[0].text,
              value: location[0].country[0].short_code,
            },
            enter_city: {
              name: location[0].name,
              country: location[0].country[0],
              label:
                location[0].name +
                ", " +
                location[0].province[0]?.short_code
                  ?.split("-")[1]
                  ?.toUpperCase(),
              province: location[0]?.province,
            },
          };
          props.initialize(data);
          setLoadingLive(false);
        }
      },
      (err) => setLoadingLive(false),
      { enableHighAccuracy: true }
    );
  };

  const { handleSubmit, invalid, pristine, submitting, touched } = props;

  const previousPage = () => {
    router.back();
  };

  if (draftDateLoading) {
    return <Loader />;
  } else {
    return (
      <div className="inner-page ">
        {/* {width > 767 && <HeaderLoggedIn />} */}
        <div className="inner-part-page">
          <div className="container create-date-wrap new-date">
            {!confirmPopup ? (
              <div className="auth-section choose-city new-city">
                <form onSubmit={handleSubmit}>
                  <CreateDateHeader
                    activeStep={0}
                    onBack={previousPage}
                    onClose={toggle}
                    showBack={true}
                    showClose={true}
                  />
                  {!confirmPopup ? (
                    <>
                      <div className="inner_container">
                        <div className="create-date-intro">
                          <h2>Where does your adventure start?</h2>
                          <div className="intro-subtitle">Pick your city.</div>
                          <div className="intro-note">
                            Want to be discoverable in multiple cities? Just
                            create a separate date for each one.
                          </div>
                        </div>
                      </div>
                      <div className="content-section">
                        {/* <p>Single post allows you to choose only one location. Hence, more posts will give you more exposure</p> */}
                        {/* <p>Please select the location where you would like to be showcased.</p>
                                  <p>Each post is showcased in one location <br /> of your choice. </p>
                                  <p>Hence if you wish to have presence in multiple location, you will need several posts.</p> */}
                      </div>
                      <div className="location-field-wrap">
                        <Field
                          name="enter_country"
                          type="text"
                          component={Inputs.renderDropdown}
                          placeholder="Enter Country"
                          withIcon={true}
                          options={locationOptions}
                          iconClick={handleIcon}
                          openMenuOnClick={false}
                          loading={loadingLive}
                        />
                        <Field
                          name="enter_city"
                          type="text"
                          component={Inputs.renderDropdown}
                          options={places}
                          placeholder="Enter City"
                          withIcon={true}
                          iconClick={handleIcon}
                          openMenuOnClick={false}
                          inputValue={inputValue}
                          onInputChange={handleChange}
                          isDisabled={!state?.enter_country?.value}
                          menuIsOpen={inputValue && places.length}
                          onChange={(value) => {
                            setInputValue("");
                            change("enter_city", value);
                          }}
                          loading={loadingLive}
                          components={{
                            Option: ({ children, ...rest }) => (
                              <components.Option {...rest}>
                                <>
                                  <h6>{children.split(",")[0]}</h6>{" "}
                                  <span>
                                    {rest.data?.province[0]?.text},{" "}
                                    {rest.data?.country[0]?.text}
                                  </span>
                                </>
                              </components.Option>
                            ),
                          }}
                        />
                      </div>
                    </>
                  ) : null}
                  <div className="bottom-mobile register-bottom choose-city-next-btn">
                    <div className="secret-input type-submit next-prev">
                      {!confirmPopup && (
                        <Link
                          href={
                            router?.query.edit
                              ? "/create-date/date-event?edit=true"
                              : "/create-date/date-event"
                          }
                        >
                          <button className="next" disabled={invalid}>
                            {/* <span className="spin-loader-button"></span> */}
                            Next <FiArrowRight />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
        <Footer />
        <ConfirmDate isOpen={confirmPopup} toggle={toggle} />
      </div>
    );
  }
};
export default reduxForm({
  form: "ChooseCity", // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(withAuth(ChooseCity));
