// import React from "react";
// import "./App.css";
// import { Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./context/ProtectedRoute";
// import Unauthorized from "./qutree/Unauthorized";
// import AdminDashboard from "./qutree/AdminComponent/Dashboard";
// import { RolesProvider } from "./context/RoleContext";
// import ChangePassword from "./qutree/HomeComponents/ChangePassword";
// import ResetPassword from "./qutree/HomeComponents/ResetPassword";
// import CreateVisitingPurpose from "./qutree/VisitorManagement/CreateVisitingPurpose";
// import VisitorForm from "./qutree/VisitorManagement/VisitorForm";
// import VisitorFormForQuikyNetUser from "./qutree/VisitorManagement/VisitorFormForQuikyNetUser";
// import QrReader from "./qutree/VisitorManagement/QrReader";
// import VisitorQRCode from "./qutree/VisitorManagement/VisitorQRCode";
// import EmailTemplates from "./qutree/VisitorManagement/EmailTemplates";
// import Support from "./qutree/HomeComponents/Support";
// import UserDashboard from "./qutree/UserComponent/UserDashboard";
// import HomeDesktop from "./qutree/HomeComponents/WebPages/HomeDesktop";
// import ExploreAndRegister from "./qutree/HomeComponents/ExploreAndRegister";
// import DigitalBusinessCard from "./qutree/HomeComponents/DigitalCard/DigitalBusinessCard";
// import QRCodeGenerator from "./qutree/AdminComponent/QRCodeGenerator";
// import VisitorsTable from "./qutree/VisitorManagement/VisitormanagementUi/VisitorsTable";
// import VisitorsManagement from "./qutree/VisitorManagement/VisitormanagementUi/VisitorsManagement";
// import { MyAgentsDashboard } from "./qutree/Agent/MyDashboard";
// import AgentDashboard from "./qutree/AdminComponent/AgentDashboard";
// import CardTable from "./qutree/Agent/CommunityLogTable";
// import { CardTableactive } from "./qutree/Agent/ActiveCardsTable";
// import { AvilableCardTable } from "./qutree/Agent/AvilableCardTable";
// import UserCardTable from "./qutree/Agent/UserCardTable";
// import ActivationChart from "./qutree/Agent/ActivationChart";
// import UserForm from "./qutree/AdminComponent/UserForm";
// import PlansComponent from "./qutree/HomeComponents/WebPages/Screen1/Plans";
// import PlanCard from "./Payment/PlanCard";
// import SuccessComponent from "./Payment/SuccessComponent";
// import FailureComponent from "./Payment/FailureComponent";
// import ContactUs from "./qutree/AdminComponent/ContactUs";
// import PricingCard from "./Payment/PricingCard";
// import PaymentTable from "./Payment/PaymentTable";
// import TermsAndConditions from "./qutree/HomeComponents/TermsAndConditions";
// import PaymentProtectedRoutes from "./context/PaymentProtectedRoutes";
// import Mainbar from "./qutree/AdminComponent/Mainbar";
// import Calendar from "./qutree/AdminComponent/Calendar";
// import Oauth from "./qutree/OAuth/Oauth";
// import UserTable from "./qutree/AdminComponent/UserTable";
// import ReferralUsersTable from "./qutree/AdminComponent/ReferralCode/ReferralUsersTable";
// import ReferralCodeTable from "./qutree/AdminComponent/ReferralCode/ReferralCodeTable";
// import ReferralCodeApplyForm from "./qutree/UserRegister/ReferralCodeApplyForm";
// import MasterAdmin_Appointment from "./qutree/doctor_appointment/MasterAdmin";
// import Admin_Appointment from "./qutree/doctor_appointment/Admin";
// import User_Appintment from "./qutree/doctor_appointment/User";
// import DoctorAppointments from "./qutree/doctor_appointment/admin/DoctorAppointments";
// import QrScannerDummy from "./QrDummy";
// import UpdateDoctorTokenLimit from "./qutree/doctor_appointment/doctor/UpdateDoctorTokenLimit";
// import QuizPollSubmitForm from "./qutree/UserRegister/QuizPollSubmitForm";
// import AppointmentForm from "./qutree/VisitorManagement/UserAppointment/AppointmentForm";
// import Homepage1 from "./qutree/HomeComponents/Homepages/Homepage1";
// import Homepage2 from "./qutree/HomeComponents/Homepages/Homepage2";

// const App = () => {
//   return (
//     // <RolesProvider>
//     //   <Routes>
    //     <Route
    //       path="/quiz-poll/:quizTitle/:quizid"
    //       element={<QuizPollSubmitForm />}
    //     />
    //     <Route path="/oauth/*" element={<Oauth />} />
    //     <Route path="/support" element={<Support />} />
    //     <Route path="/plans" element={<PlansComponent />} />
    //     <Route
    //       path="/plan-card/:encodedUserId/:encodedUserQCardId"
    //       element={<PlanCard />}
    //     />
    //     <Route path="/qr" element={<QrScannerDummy />} />
    //     <Route path="/" element={<HomeDesktop />} />
    //     <Route path="/home" element={<HomeDesktop />} />
    //     <Route path="/explore" element={<ExploreAndRegister />} />
    //     <Route
    //       path="/terms-and-conditions-of-service"
    //       element={<TermsAndConditions />}
    //     />

    //     <Route path="/digital-card/:id" element={<DigitalBusinessCard />} />
    //     <Route path="/business-card/:id" element={<DigitalBusinessCard />} />

    //     <Route path="/pricing" element={<PricingCard />} />
    //     <Route
    //       path="/payment/success/:encodedUserId/:encodedOrderId"
    //       element={<SuccessComponent />}
    //     />
    //     <Route
    //       path="/payment/failure/:encodedUserId/:encodedOrderId"
    //       element={<FailureComponent />}
    //     />

    //     <Route path="/forgot-password" element={<ResetPassword />} />

    //     <Route path="/visitor/check-in" element={<VisitorForm />} />
    //     <Route
    //       path="/visitor/check-in/:id"
    //       element={<VisitorFormForQuikyNetUser />}
    //     />

    //     <Route path="/qr-reader" element={<QrReader />} />
    //     {/* <Route path="/appointment" element={<AppointmentForm />} /> */}

    //     <Route path="/payment" element={<ReferralCodeApplyForm />} />

    //     <Route path="/*" element={<PaymentProtectedRoutes />} />

    //     {/* Admin routes */}
    //     <Route
    //       path="/admin/dashboard"
    //       element={
    //         <ProtectedRoute
    //           element={<AdminDashboard />}
    //           requiredRoles={["MASTER_ADMIN", "ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/card"
    //       element={
    //         <ProtectedRoute
    //           element={<UserDashboard />}
    //           requiredRoles={[
    //             "USER",
    //             "AGENT",
    //             "ADMIN",
    //             "MASTER_ADMIN",
    //             "CANDIDATE",
    //             "SECURITY",
    //           ]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/referral-code"
    //       element={
    //         <ProtectedRoute
    //           element={<ReferralCodeTable />}
    //           requiredRoles={["ADMIN", "USER"]}
    //         />
    //       }
    //     />

    //     <Route
    //       path="/referral-table"
    //       element={
    //         <ProtectedRoute
    //           element={<ReferralUsersTable />}
    //           requiredRoles={["MASTER_ADMIN", "ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/user/details"
    //       element={
    //         <ProtectedRoute
    //           element={<UserTable />}
    //           requiredRoles={["MASTER_ADMIN", "ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/qr-generate"
    //       element={
    //         <ProtectedRoute
    //           element={<QRCodeGenerator />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/register-user"
    //       element={
    //         <ProtectedRoute
    //           element={<UserForm />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/contact-us"
    //       element={
    //         <ProtectedRoute
    //           element={<ContactUs />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/payment-table"
    //       element={
    //         <ProtectedRoute
    //           element={<PaymentTable />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />

    //     {/* Routes for all */}
    //     <Route
    //       path="/unauthorized"
    //       element={
    //         <ProtectedRoute
    //           element={<Unauthorized />}
    //           requiredRoles={[
    //             "USER",
    //             "AGENT",
    //             "ADMIN",
    //             "MASTER_ADMIN",
    //             "CANDIDATE",
    //             "SECURITY",
    //           ]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/change-password"
    //       element={
    //         <ProtectedRoute
    //           element={<ChangePassword />}
    //           requiredRoles={[
    //             "USER",
    //             "AGENT",
    //             "ADMIN",
    //             "MASTER_ADMIN",
    //             "CANDIDATE",
    //             "SECURITY",
    //           ]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/email"
    //       element={
    //         <ProtectedRoute
    //           element={<EmailTemplates />}
    //           requiredRoles={[
    //             "USER",
    //             "AGENT",
    //             "ADMIN",
    //             "MASTER_ADMIN",
    //             "CANDIDATE",
    //           ]}
    //         />
    //       }
    //     />

    //     {/* Vistors for all */}
    //     <Route
    //       path="/create/visiting-purposes"
    //       element={
    //         <ProtectedRoute
    //           element={<CreateVisitingPurpose />}
    //           requiredRoles={["MASTER_ADMIN", "ADMIN", "VISITOR_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/checked-in-vistors"
    //       element={
    //         <ProtectedRoute
    //           // element={<CheckedInVisitorsTable />}
    //           element={<VisitorsTable />}
    //           requiredRoles={["MASTER_ADMIN", "ADMIN", "VISITOR_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/vistor-qr-code"
    //       element={
    //         <ProtectedRoute
    //           element={<VisitorQRCode />}
    //           requiredRoles={["MASTER_ADMIN", "ADMIN", "VISITOR_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/qrcode"
    //       element={
    //         <ProtectedRoute
    //           element={<VisitorsManagement />}
    //           requiredRoles={[
    //             "USER",
    //             "AGENT",
    //             "ADMIN",
    //             "MASTER_ADMIN",
    //             "CANDIDATE",
    //           ]}
    //         />
    //       }
    //     />

    //     {/* Agent for all */}
    //     <Route
    //       path="/cardmanagement"
    //       element={
    //         <ProtectedRoute
    //           element={<Mainbar />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/agentmanagement"
    //       element={
    //         <ProtectedRoute
    //           element={<AgentDashboard />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/my-cards"
    //       element={
    //         <ProtectedRoute element={<CardTable />} requiredRoles={["AGENT"]} />
    //       }
    //     />
    //     <Route
    //       path="/my-active-cards"
    //       element={
    //         <ProtectedRoute
    //           element={<CardTableactive />}
    //           requiredRoles={["AGENT"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/my-active-Customers"
    //       element={
    //         <ProtectedRoute
    //           element={<UserCardTable />}
    //           requiredRoles={["AGENT"]}
    //         />
    //       }
    //     />

    //     <Route
    //       path="/activation"
    //       element={
    //         <ProtectedRoute
    //           element={<ActivationChart />}
    //           requiredRoles={["AGENT"]}
    //         />
    //       }
    //     />

    //     <Route
    //       path="/my-available-cards"
    //       element={
    //         <ProtectedRoute
    //           element={<AvilableCardTable />}
    //           requiredRoles={["AGENT"]}
    //         />
    //       }
    //     />

    //     <Route
    //       path="/mycustomers"
    //       element={
    //         <ProtectedRoute
    //           element={<MyAgentsDashboard />}
    //           requiredRoles={["AGENT"]}
    //         />
    //       }
    //     />

    //     <Route
    //       path="/calendar"
    //       element={
    //         <ProtectedRoute
    //           element={<Calendar />}
    //           requiredRoles={["ADMIN", "MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/admin-tokens"
    //       element={
    //         <ProtectedRoute
    //           element={<Admin_Appointment />}
    //           requiredRoles={["ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/admin/update-token-limit"
    //       element={
    //         <ProtectedRoute
    //           element={<UpdateDoctorTokenLimit />}
    //           requiredRoles={["ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/doctor/:doctorId/appointments"
    //       element={
    //         <ProtectedRoute
    //           element={<DoctorAppointments />}
    //           requiredRoles={["ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/masteradmin-tokens"
    //       element={
    //         <ProtectedRoute
    //           element={<MasterAdmin_Appointment />}
    //           requiredRoles={["MASTER_ADMIN"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/user-tokens"
    //       element={
    //         <ProtectedRoute
    //           element={<User_Appintment />}
    //           requiredRoles={["USER"]}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/appointment"
    //       element={
    //         <ProtectedRoute
    //           element={<AppointmentForm />}
    //           requiredRoles={[
    //             "USER",
    //             "AGENT",
    //             "ADMIN",
    //             "SECURITY",
    //             "CANDIDATE",
    //           ]}
    //         />
    //       }
    //     />
    //   </Routes>
    // </RolesProvider>
    // <Homepage1 />
//     <Homepage2 />
//   );
// };

// export default App;

// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage1 from  './qutree/HomeComponents/Homepages/Homepage1';
import Homepage2 from  './qutree/HomeComponents/Homepages/Homepage2';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage1 />}/>
      <Route path="/Homepage2" element={<Homepage2 />}/>
    </Routes>
  );
}

export default App;
