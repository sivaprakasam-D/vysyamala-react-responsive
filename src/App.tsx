import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import LoginLayout from "./Layout/LoginLayout";

// Pages Components
import { HomePage } from "./Pages/HomePage";
import { ThankYou } from "./Pages/ThankYou";
import ContactDetails from "./Pages/ContactDetails";
import UploadImages from "./Pages/UploadImages";
import FamilyDetails from "./Pages/FamilyDetails";
import EduDetails from "./Pages/EduDetails";
import HoroDetails from "./Pages/HoroDetails";
import PartnerSettings from "./Pages/PartnerSettings";
import { MembershipPlan } from "./Pages/MembershipPlan";
import { PayNow } from "./Pages/PayNow";
import { ThankYouReg } from "./Pages/ThankYouReg";
import { LoginHome } from "./Pages/AfterLogin/LoginHome";
import Search from "./Pages/AfterLogin/Search";
import { DashBoard } from "./Pages/AfterLogin/DashBoard";
import { Wishlist } from "./Pages/AfterLogin/Wishlist";
import { Notifications } from "./Pages/AfterLogin/Notifications";
import { Messages } from "./Pages/AfterLogin/Messages";
import { MyProfile } from "./Pages/AfterLogin/MyProfile";
import { ProfileDetails } from "./Pages/AfterLogin/ProfileDetails";
import { ProfileProvider } from "./ProfileContext";
import ProfileGrid from "./Components/LoginHome/MatchingProfiles/GridView";
import ListView from "./Components/LoginHome/MatchingProfiles/ListView";         // Import ListView
import GridListView from "./Components/LoginHome/MatchingProfiles/GridListView"; // Import GridListView
import ProtectedRoute from "./Components/ProtectorRoute";
import RegistrationProtectedRoute from "./Components/RegistrationProtectedRoute";
import { UpgradePlan } from "./Pages/AfterLogin/UpgradePlan";
import { UpgradePayNow } from "./Pages/AfterLogin/UpgradePayNow";
import { UpgradeThankYouReg } from "./Pages/AfterLogin/UpgradeThankYouReg";

function App() {
  const token = sessionStorage.getItem("token");
  console.log("Current token:", token); // Log token value for debugging

  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                token ? <Navigate to="/LoginHome" replace /> : <HomePage />
              }
            />

            <Route element={<RegistrationProtectedRoute redirectTo="/" />}>
              <Route path="/ContactDetails" element={<ContactDetails />} />
              <Route path="/UploadImages" element={<UploadImages />} />
              <Route path="/FamilyDetails" element={<FamilyDetails />} />
              <Route path="/EduDetails" element={<EduDetails />} />
              <Route path="/HoroDetails" element={<HoroDetails />} />
              <Route path="/PartnerSettings" element={<PartnerSettings />} />
              <Route path="/MembershipPlan" element={<MembershipPlan />} />
              <Route path="/PayNow" element={<PayNow />} />
              <Route path="/ThankYou" element={<ThankYou />} />
              <Route path="/ThankYouReg" element={<ThankYouReg />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute redirectTo="/" />}>
            <Route element={<LoginLayout />}>
              <Route path="/LoginHome" element={<LoginHome />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/DashBoard" element={<DashBoard />} />
              <Route path="/Wishlist" element={<Wishlist />} />
              <Route path="/Messages" element={<Messages />} />
              <Route path="/Notifications" element={<Notifications />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/ProfileDetails" element={<ProfileDetails />} />
              <Route path="/ProfileGrid" element={<ProfileGrid />} />
              <Route path="/ListView" element={<ListView />} />
              <Route path="/GridListView" element={<GridListView />} />
              <Route path="/UpgradePlan" element={<UpgradePlan />} />
              <Route path="/UpgradePayNow" element={<UpgradePayNow />} />
              <Route path="/UpgradeThankYouReg" element={<UpgradeThankYouReg />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to={token ? "/LoginHome" : "/"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
