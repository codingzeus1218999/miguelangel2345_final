import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import AuthModal from "./components/form/AuthModal";

import PrivateRoute from "./utils/privateRoute";

import Home from "./pages/Home";
import CasinoBonus from "./pages/CasinoBonus";
import Videos from "./pages/Videos";
import Stream from "./pages/Stream";
import Tournaments from "./pages/Tournaments";
import Store from "./pages/Store";
import StoreDetail from "./pages/StoreDetail";
import News from "./pages/News";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import { NavProvider } from "./context/NavContext";
import { ModalProvider } from "./context/ModalContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <NavProvider>
          <ModalProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/casino-bonus" element={<CasinoBonus />} />
              <Route exact path="/videos" element={<Videos />} />
              <Route exact path="/stream" element={<Stream />} />
              <Route exact path="/tournaments" element={<Tournaments />} />
              <Route exact path="/store" element={<Store />} />
              <Route exact path="/store/:id" element={<StoreDetail />} />
              <Route exact path="/news" element={<News />} />
              <Route exact path="/about-us" element={<AboutUs />} />
              <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                exact
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route exact path="/cookie-policy" element={<CookiePolicy />} />
              <Route exact path="/verify/:token" element={<VerifyEmail />} />
              <Route
                exact
                path="/forgot-password/:token"
                element={<ResetPassword />}
              />
              <Route
                exact
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route exact path="*" element={<NotFound />} />
            </Routes>
            <AuthModal />
            <NotificationContainer />
          </ModalProvider>
        </NavProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
