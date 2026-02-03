import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CustomIcon } from "core/icon";
import UserImg from "assets/img/profile.png";
import Image from "next/image";
import SubHeading from "./SubHeading";
import H5 from "./H5";
import { HiBadgeCheck } from "react-icons/hi";
import { FiChevronRight } from "react-icons/fi";

import { useSelector, useDispatch } from "react-redux";
import { deAuthenticateAction, logout } from "../modules/auth/authActions";
import { useRouter } from "next/router";
import _ from "lodash";
import { BiTime } from "react-icons/bi";
import { reset } from "redux-form";
import { apiRequest } from "utils/Utilities";
import io from "socket.io-client";
import { socket } from "pages/user/user-list";
import PricingMenuModal from "./PricingMenuModal";
import interestedLocked from "../assets/interested-locked.svg";
import superInterestedLocked from "../assets/superinterested-locked.svg";

export default function SideBar({ isActive, count }) {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const formValue = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const router = useRouter();
  const [documentUpoaded, setDocumentUpoaded] = useState(false);
  const [notifData, setNotifdata] = useState(null);
  
  // Token counts for both genders
  const interestedTokens = user?.interested_tokens || 0;
  const superInterestedTokens = user?.super_interested_tokens || 0;
  const chatTokens = user?.chat_tokens || 0;
  const isPaidMember = interestedTokens > 0 || superInterestedTokens > 0;
  // const [count, setCount] = useState(0);
  // const socket = io(socketURL, {
  //   autoConnect: true,
  // });

  useEffect(() => {
    if (user?.selfie && user?.document) {
      setDocumentUpoaded(true);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const params = {
        user_email: user.email,
        sort: "sent_time",
      };
      const { data } = await apiRequest({
        method: "GET",
        url: `notification`,
        params: params,
      });
      setNotifdata(data?.data?.notification);
    } catch (err) {
      console.error("err", err);
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

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // useEffect(() => {
  //   if (isActive) {
  //     fetchNotifications();
  //   }
  // }, [isActive]);

  // useEffect(() => {
  //   socket.auth = { user: "admin@getnada.com" };
  //   socket.connect();
  //   console.log("socket", socket.auth);
  //   socket.on("connect", () => {
  //     console.log("connected", socket.connected);
  //   });
  //   socket.on("disconnect", (reason) => {
  //     console.log("socket disconnected reason", reason);
  //   });
  //   console.log("socket Notif socket intiated called");
  // }, []);

  // useEffect(() => {
  //   socket.on("connect_error", () => {
  //     console.log("connect_error");
  //     socket.auth = { user: user };
  //     socket.connect();
  //   });
  // }, [!socket.connected]);

  // useEffect(() => {
  //   console.log("Notif socket connected", socket.connected);
  //   socket.on("connect", () => {
  //     console.log(socket.id);
  //   });
  //   socket.on(`push-notification-${user.email}`, (message) => {
  //     console.log("notif received", message);
  //     const unc = message?.notifications?.filter(
  //       (item) => item.status === 0 && item.type !== "notification"
  //     ).length;
  //     localStorage.setItem("unreadNotifCount", JSON.stringify(unc));
  //     setCount(unc);
  //   });
  // }, [socket.connected]);

  // useEffect(() => {
  //   console.log("notiffff ", notifData);
  //   const unc = notifData?.filter(
  //     (item) => item.status === 0 && item.type !== "notification"
  //   ).length;
  //   console.log("count ", unc);
  //   localStorage.setItem("unreadNotifCount", JSON.stringify(unc));
  //   let unreadNotifCount;
  //   unreadNotifCount = localStorage.getItem("unreadNotifCount");
  //   setCount(unreadNotifCount);
  //   console.log("unreadNotifCount ", unreadNotifCount);
  // }, [notifData]);

  // convert createat to month year format
  const memberSince = user?.created_at
    ? new Date(user?.created_at)?.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";
  const defaultMaxChats = 15;
  // Use chat_tokens from Redux store (purchased tokens) or fallback to remaining_chats
  const remainingChats = chatTokens > 0 ? chatTokens : (
    user?.remaining_chats !== undefined && user?.remaining_chats !== null
      ? user?.remaining_chats
      : defaultMaxChats
  );
  const ringMaxChats = Math.max(defaultMaxChats, remainingChats || defaultMaxChats);
  const ringDash = `${Math.max(0, Math.min(remainingChats, ringMaxChats)) / ringMaxChats * 220} 220`;

  return (
    <>
      <PricingMenuModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
      <div className="sidebar_wrap">
        <div className="sidebar-content">
          <div className="user-card-sidebar">
            <div className="d-flex align-items-center mb-4">
              <figure className="mb-0 p-0">
                <img
                  src={!_.isEmpty(user) ? user?.images[0] : UserImg}
                  alt="user image"
                  width={50}
                  height={50}
                />
              </figure>
              <span className="userdetails">
                <H5 style={{ fontSize: "18px", letterSpacing: "0.09px" }}>
                  {user?.user_name || ""}
                </H5>
                <SubHeading title={`Member since ${memberSince}`} />
              </span>
            </div>
            <div className="d-flex align-items-center mb-0 header_btn_wrap">
              {router.asPath === "/user/user-profile" ? (
                <a className="cursor-pointer">View Profile</a>
              ) : (
                <Link href="/user/user-profile">
                  <a>View Profile</a>
                </Link>
              )}
              <Link href="/auth/profile?edit=true">
                <a>Edit Profile</a>
              </Link>
            </div>
          </div>
          {/* Current Plan Section - Men Only */}
          {user?.gender === "male" && (
            <div className="user-card-sidebar sidebar-plan-card">
              <div className="sidebar-plan-header">
                <div className="sidebar-plan-label">Current Plan</div>
                <div className="sidebar-plan-name">
                  {isPaidMember ? (
                    <>
                      <span>Priority Member</span> – Full Access
                    </>
                  ) : (
                    <>
                      <span>The Test Drive</span> – Limited Access
                    </>
                  )}
                </div>
              </div>
              
              {!isPaidMember ? (
                // Non-paid member: Show locked circles with original SVG assets
                <>
                  <div className="sidebar-plan-icons sidebar-plan-locked">
                    <div className="token-circle locked">
                      <Image src={interestedLocked} alt="Interested Locked" width={110} height={120} />
                    </div>
                    <div className="token-circle locked">
                      <Image src={superInterestedLocked} alt="Super Interested Locked" width={111} height={120} />
                    </div>
                  </div>
                  <div className="sidebar-plan-note">Add tokens to get started.</div>
                </>
              ) : (
                // Paid member: Show token counts
                <>
                  <div className="sidebar-plan-icons sidebar-plan-active">
                    <div className="token-circle active">
                      <div className="token-label">Interested</div>
                      <div className="token-circle-inner">
                        <svg viewBox="0 0 100 100" className="token-ring">
                          <defs>
                            <linearGradient id="token-gradient-interested" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f24462" />
                              <stop offset="100%" stopColor="#4a90e2" />
                            </linearGradient>
                          </defs>
                          <circle cx="50" cy="50" r="42" className="token-ring-bg" />
                          <circle cx="50" cy="50" r="42" className="token-ring-progress" style={{ strokeDasharray: '264 264', stroke: 'url(#token-gradient-interested)' }} />
                        </svg>
                        <div className="token-value">{interestedTokens}</div>
                      </div>
                    </div>
                    <div className="token-circle active">
                      <div className="token-label">Super Interested</div>
                      <div className="token-circle-inner">
                        <svg viewBox="0 0 100 100" className="token-ring">
                          <defs>
                            <linearGradient id="token-gradient-super" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f24462" />
                              <stop offset="100%" stopColor="#4a90e2" />
                            </linearGradient>
                          </defs>
                          <circle cx="50" cy="50" r="42" className="token-ring-bg" />
                          <circle cx="50" cy="50" r="42" className="token-ring-progress" style={{ strokeDasharray: '264 264', stroke: 'url(#token-gradient-super)' }} />
                        </svg>
                        <div className="token-value">{superInterestedTokens}</div>
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-plan-note">Need more? Top up anytime.</div>
                </>
              )}
              
              <button
                type="button"
                className="sidebar-topup-btn"
                onClick={() => setShowPricingModal(true)}
              >
                Top Up Tokens
              </button>
            </div>
          )}
          {/* Membership Section - Women Only (Conversations) */}
          {user?.gender === "female" && (
            <div className="user-card-sidebar sidebar-membership-card">
              <div className="sidebar-membership-header">
                <div className="sidebar-membership-label">Membership</div>
                <div className="sidebar-membership-plan">
                  <span>The Test Drive:</span> Limited Access
                </div>
              </div>

              <div className="sidebar-membership-row">
                <div className="sidebar-membership-text">
                  <div className="sidebar-membership-title">
                    Conversations Left.
                  </div>
                  <div className="sidebar-membership-subtext">
                    Start a new chat anytime. Your balance updates as you go.
                  </div>
                </div>
                <div className="sidebar-ring">
                  <svg viewBox="0 0 80 80" aria-hidden="true">
                    <circle className="ring-bg" cx="40" cy="40" r="35" />
                    <circle
                      className="ring-progress"
                      cx="40"
                      cy="40"
                      r="35"
                      strokeDasharray={ringDash}
                    />
                    <defs>
                      <linearGradient
                        id="sidebar-ring-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#f24462" />
                        <stop offset="100%" stopColor="#4a90e2" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="sidebar-ring-value">{remainingChats}</div>
                </div>
              </div>

              <button
                type="button"
                className="sidebar-topup-btn"
                onClick={() => setShowPricingModal(true)}
              >
                Top Up Tokens
              </button>
            </div>
          )}
          <div className="verification_card_header text-center mb-3">
            <div className="mb-5">
              {/* <HiBadgeCheck color={"white"} size={50} /> */}
            </div>
            <div className="d-flex align-items-center mb-0 header_btn_wrap">
              <button
                type="button"
                style={{ marginTop: "-42px" }}
                className="d-flex align-items-center justify-content-center"
                onClick={() =>
                  !documentUpoaded && router.push("/verified-profile")
                }
              >
                <span className="pt-0">
                  {user?.documents_verified
                    ? "VERIFIED"
                    : !documentUpoaded
                    ? "VERIFY PROFILE"
                    : "PENDING"}
                </span>
                {user?.documents_verified ? (
                  <HiBadgeCheck
                    color={"white"}
                    size={25}
                    style={{ paddingLeft: "5px" }}
                  />
                ) : !documentUpoaded ? (
                  <HiBadgeCheck
                    color={"white"}
                    size={25}
                    style={{ paddingLeft: "5px" }}
                  />
                ) : (
                  <BiTime
                    color={"grey"}
                    size={25}
                    style={{ paddingLeft: "5px" }}
                  />
                )}
              </button>
            </div>
            <SubHeading title="Let them know you are real" />
          </div>
          {user?.gender === "female" && (
            <div className="verification_card_header text-center mb-2">
              {/* <div className="mb-2">
              <CustomIcon.ChampaignCaviar color={"#AFABAB"} size={50} />
            </div> */}
              {/* <SubHeading title="Stay ahead of the crowd" /> */}
              <div className="d-flex align-items-center mb-0 mt-3 header_btn_wrap">
                <button
                  onClick={() => router.push("/create-date/choose-city")}
                  type="button"
                  className="create-date"
                >
                  Create New Date
                </button>
              </div>
              <SubHeading title="Stay ahead of the crowd" />
            </div>
          )}
          <div className="user-card-sidebar sidebar-nav-link">
            <div className="sidebar_nav_links">
              <ul>
                <li>
                  <Link href="/">
                    <a>
                      Setting <FiChevronRight size={22} />{" "}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <a>
                      Privacy <FiChevronRight size={22} />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <a>
                      Terms <FiChevronRight size={22} />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bottom-footer-sidebar">
          <div className="d-flex align-items-center mb-0 header_btn_wrap log-btn">
            <button
              className="log-btn d-flex align-items-center justify-content-center "
              type="button"
              onClick={() => {
                logout(router, dispatch);
              }}
            >
              Log Out
            </button>
          </div>
          <SubHeading title="LeSociety. Copywrite 2023 " />
        </div>
      </div>
    </>
  );
}
