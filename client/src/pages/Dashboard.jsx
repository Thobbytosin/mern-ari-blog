import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import styles from "../styles";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardOverview from "../components/DashboardOverview";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <div
      className={`${styles.padding} min-h-screen  flex flex-col gap-8 md:flex-row mb-10 font-poppins `}
    >
      <div className="mb-4 sm:mb-0">
        {/* DASH SIDEBAR */}
        <DashSidebar />
      </div>
      <div className="min-h-screen w-full  overflow-clip ">
        {tab === "profile" && <DashProfile />}
        {tab === "users" && <DashUsers />}
        {tab === "posts" && <DashPosts />}
        {tab === "comments" && <DashComments />}
        {tab === "dashboard" && <DashboardOverview />}
      </div>
    </div>
  );
};

export default Dashboard;
