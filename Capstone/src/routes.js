// import
import React, { Component }  from 'react';
import Dashboard from "views/Dashboard/Dashboard.js";
import Dashboard1 from "views/Dashboard/Dashboard1.js";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import upload from 'views/Pages/upload';
import DisplayFiles from 'views/Dashboard/DisplayFiles';
import ReceivedFiles from 'views/Dashboard/ReceivedFiles';
import ViewInvisibleWatermark from 'views/Pages/ViewInvisibleWatermark';

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard1,
    layout: "/admin",
  },  
  {
    path: "/DisplayFiles",
    name: "My files",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: DisplayFiles,
    layout: "/admin",
  },  
  {
    path: "/upload",
    name: "Upload file",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: upload,
    layout: "/admin",
  },
  {
    path: "/ReceivedFiles",
    name: "Received files",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: ReceivedFiles,
    layout: "/admin",
  },
  {
    path: "/ViewInvisibleWatermark",
    name: "View Invisible Watermark",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: ViewInvisibleWatermark,
    layout: "/admin",
  },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   rtlName: "لوحة القيادة",
  //   icon: <StatsIcon color='inherit' />,
  //   component: Tables,
  //   layout: "/admin",
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   rtlName: "لوحة القيادة",
  //   icon: <CreditIcon color='inherit' />,
  //   component: Billing,
  //   layout: "/admin",
  // },
  // {
  //   path: "/rtl-support-page",
  //   name: "RTL",
  //   rtlName: "آرتيإل",
  //   icon: <SupportIcon color='inherit' />,
  //   component: RTLPage,
  //   layout: "/rtl",
  // }, 
  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        layout: "/auth",
      },
      {
        path: "/logout",
        name: "logout",
        component: SignIn,
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;
