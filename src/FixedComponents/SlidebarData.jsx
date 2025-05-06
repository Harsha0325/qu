import { ImShare } from "react-icons/im"; 
import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { SiGotomeeting } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { FaRegAddressCard } from "react-icons/fa";
import { RiCustomerService2Line } from "react-icons/ri";
// import { GrDocumentTime } from "react-icons/gr";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdSpaceDashboard />,
    cName: "nav-text",
    roles: ["USER", "AGENT", "SECURITY"],
  },
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdSpaceDashboard />,
    cName: "nav-text",
    roles: ["MASTER_ADMIN", "ADMIN"],
  },
  {
    title: "Dashboard",
    path: "/candidate/dashboard",
    icon: <MdSpaceDashboard />,
    cName: "nav-text",
    roles: ["CANDIDATE"],
  },
  {
    title: "Business Card",
    path: "/card",
    icon: <FaAddressCard />,
    cName: "nav-text",
    roles: ["ADMIN"],
  },
  {
    title: "Visitor's",
    path: "/checked-in-vistors",
    icon: <MdOutlinePermContactCalendar />,
    cName: "nav-text",
    roles: ["MASTER_ADMIN", "ADMIN" , "VISITOR_ADMIN"],
  },
  {
    title: "Community",
    path: "/community",
    icon: <SiGotomeeting />,
    cName: "nav-text",
    roles: ["USER", "AGENT", "ADMIN", "SECURITY", "CANDIDATE"],
  },
  // {
  //   title: "Appointment",
  //   path: "/appointment",
  //   icon: <GrDocumentTime/>,
  //   cName: "nav-text",
  //   roles: ["USER", "AGENT", "ADMIN", "SECURITY", "CANDIDATE"],
  // },
  {
    title: "CardManagement",
    path: "/cardmanagement",
    icon: <FaRegAddressCard />,
    cName: "nav-text",
    roles: ["ADMIN", "MASTER_ADMIN"],
  },
  {
    title: "Agents",
    path: "/agentmanagement",
    icon: <CgProfile />,
    cName: "nav-text",
    roles: ["ADMIN", "MASTER_ADMIN"],
  },
  {
    title: "Customers",
    path: "/mycustomers",
    icon: <RiCustomerService2Line />,
    cName: "nav-text",
    roles: ["AGENT"],
  },

  // {
  //   title: "Book Appointment",
  //   path: "/user-tokens",
  //   icon: <RiCustomerService2Line />,
  //   cName: "nav-text",
  //   roles: ["USER"],
  // },
  // {
  //   title: "Appointments",
  //   path: "/admin-tokens",
  //   icon: <RiCustomerService2Line />,
  //   cName: "nav-text",
  //   roles: ["ADMIN"],
  // },
  // {
  //   title: "Appointments",
  //   path: "/masteradmin-tokens",
  //   icon: <RiCustomerService2Line />,
  //   cName: "nav-text",
  //   roles: ["MASTER_ADMIN"],
  // },

  {
    title: "Referral Code",
    path: "/referral-table",
    icon: <ImShare />,
    cName: "nav-text",
    roles: ["MASTER_ADMIN", "ADMIN"],
  },
];
