import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import Login from "./pages/Login";
import EditUser from "./pages/Users/EditUser";
import Users from "./pages/Users";
import Redemptions from "./pages/Redemptions";
import RedemptionHistory from "./pages/Redemptions/RedemptionHistory";
import Raffle from "./pages/Raffle";
import Betting from "./pages/Betting";
import ChatbotSettings1 from "./pages/Chatbot/ChatbotSettings1";
import ChatbotSettings2 from "./pages/Chatbot/ChatbotSettings2";
import ChatbotSettings3 from "./pages/Chatbot/ChatbotSettings3";
import ChatbotHistory from "./pages/Chatbot/ChatbotHistory";
import ChatbotRealtime from "./pages/Chatbot/ChatbotRealtime";
import NotFound from "./pages/NotFound";

import { NavProvider } from "./context/NavContext";
import { UserProvider } from "./context/UserContext";
import Items from "./pages/Items";
import AddItem from "./pages/Items/AddItem";
import EditItem from "./pages/Items/EditItem";

function App() {
  return (
    <Router>
      <UserProvider>
        <NavProvider>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/users/:id" element={<EditUser />} />
            <Route exact path="/redemptions" element={<Redemptions />} />
            <Route
              exact
              path="/redemption-history"
              element={<RedemptionHistory />}
            />
            <Route exact path="/items" element={<Items />} />
            <Route exact path="/items/:id" element={<EditItem />} />
            <Route exact path="/items/add" element={<AddItem />} />
            <Route
              exact
              path="/chatbot-settings-1"
              element={<ChatbotSettings1 />}
            />
            <Route
              exact
              path="/chatbot-settings-2"
              element={<ChatbotSettings2 />}
            />
            <Route
              exact
              path="/chatbot-settings-3"
              element={<ChatbotSettings3 />}
            />
            <Route exact path="/chatbot-history" element={<ChatbotHistory />} />
            <Route
              exact
              path="/chatbot-realtime"
              element={<ChatbotRealtime />}
            />
            <Route exact path="/raffle" element={<Raffle />} />
            <Route exact path="/betting" element={<Betting />} />
            <Route exact path="*" element={<NotFound />} />
          </Routes>
          <NotificationContainer />
        </NavProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
