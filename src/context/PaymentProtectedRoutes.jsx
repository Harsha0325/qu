import React from "react";
import { Routes, Route } from "react-router-dom";
import { PaymentProvider } from "./PaymentContext";
import ProtectedPaymentRoute from "./ProtectedPaymentRoute";
import Dashboard from "../qutree/UserComponent/Dashboard";
// import UpdateCard from "../qutree/UpdateCard";
import UserAdditionalDetailForm from "../qutree/UserComponent/UserAdditionalDetailForm";
import AccountSettingsForm from "../qutree/UserComponent/AccountSettingsForm";
import CommunityMembers from "../qutree/Community/CommunityMembers";
import CommunityList from "../qutree/Community/CommunityList";
import CommunityChat from "../qutree/Community/CommunityChat";
import CommunityUpdateForm from "../qutree/Community/CommunityUpdateForm";
import CreateCommunityForm from "../qutree/Community/CreateCommunityForm";
import JoinCommunity from "../qutree/Community/JoinCommunity";
import JoinRequests from "../qutree/Community/JoinRequests";
import CandidateDashboard from "../qutree/Candidate/CandidateDashboard";
import UpdateCardForm from "../qutree/UserComponent/UpdateCardForm";
const PaymentProtectedRoutes = () => {
  return (
    <PaymentProvider>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedPaymentRoute
              element={<Dashboard />}
              requiredRoles={["USER", "AGENT", "ADMIN", "MASTER_ADMIN", "CANDIDATE", "SECURITY"]}
            />
          }
        />
        {/* <Route
          path="/update/:id"
          element={
            <ProtectedPaymentRoute
              element={<UpdateCard />}
              requiredRoles={["USER", "AGENT", "ADMIN", "MASTER_ADMIN", "CANDIDATE", "SECURITY"]}
            />
          }
        /> */}

            <Route
            path="/updates"
            element={
              <ProtectedPaymentRoute
                element={<UpdateCardForm />}
                requiredRoles={["MASTER_ADMIN" ,"ADMIN", "USER"]}
              />
            }
          />
            <Route
            path="/additional-user-details"
            element={
              <ProtectedPaymentRoute
                element={<UserAdditionalDetailForm />}
                requiredRoles={["USER","AGENT", "ADMIN", "MASTER_ADMIN", "CANDIDATE", "SECURITY"]}
              />
            }
          />
          <Route
            path="/account-setting"
            element={
              <ProtectedPaymentRoute
                element={<AccountSettingsForm />}
                requiredRoles={["USER","AGENT", "ADMIN", "MASTER_ADMIN", "CANDIDATE"]}
              />
            }
          />


          {/* Community routes */}
          <Route
            path="/community/:communityId/members"
            element={
              <ProtectedPaymentRoute
                element={<CommunityMembers />}
                requiredRoles={["USER","AGENT", "ADMIN", "SECURITY", "CANDIDATE"]}
              />
            }
          />
          <Route
            path="edit/community/"
            element={
              <ProtectedPaymentRoute
                element={<CommunityUpdateForm />}
                requiredRoles={["USER","AGENT", "ADMIN", "SECURITY", "CANDIDATE"]}
              />
            }
          />
          <Route
            path="/community/:communityId/chat"
            element={
              <ProtectedPaymentRoute
                element={<CommunityChat />}
                requiredRoles={["USER","AGENT", "ADMIN", "SECURITY", "CANDIDATE"]}
              />
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedPaymentRoute
                element={<CommunityList />}
                requiredRoles={["USER","AGENT", "ADMIN", "SECURITY", "CANDIDATE"]}
              />
            }
          />
          <Route
            path="/create/community"
            element={
              <ProtectedPaymentRoute
                element={<CreateCommunityForm />}
                requiredRoles={["USER","AGENT", "ADMIN", "SECURITY", "CANDIDATE"]}
              />
            }
          />
           <Route
            path="/join-community"
            element={
              <ProtectedPaymentRoute
                element={<JoinCommunity />}
                requiredRoles={["USER","AGENT", "ADMIN", "MASTER_ADMIN", "SECURITY", "CANDIDATE"]}
              />
            }
          />
           <Route
            path="/join"
            element={
              <ProtectedPaymentRoute
                element={<JoinRequests />}
                requiredRoles={["USER","AGENT", "ADMIN", "MASTER_ADMIN", "CANDIDATE", "SECURITY"]}
              />
            }
          />

          {/* Candidate routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedPaymentRoute
                element={<CandidateDashboard />}
                requiredRoles={["CANDIDATE"]}
              />
            }
          />

      </Routes>
    </PaymentProvider>
  );
};

export default PaymentProtectedRoutes;

