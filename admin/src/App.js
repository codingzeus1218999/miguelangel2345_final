import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import Login from "./pages/Login";
import EditUser from "./pages/Users/EditUser";
import Users from "./pages/Users";
import Prizes from "./pages/Prizes";
import EditPrize from "./pages/Prizes/EditPrize";
import AddPrize from "./pages/Prizes/AddPrize";
import Raffle from "./pages/Raffle";
import ChatbotSettings from "./pages/Chatbot/ChatbotSettings";
import ChatbotHistory from "./pages/Chatbot/ChatbotHistory";
import ChatbotRealtime from "./pages/Chatbot/ChatbotRealtime";
import NotFound from "./pages/NotFound";

import { NavProvider } from "./context/NavContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <NavProvider>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/users/:id" element={<EditUser />} />
            <Route exact path="/prizes" element={<Prizes />} />
            <Route exact path="/prizes/:id" element={<EditPrize />} />
            <Route exact path="/prizes/add" element={<AddPrize />} />
            <Route
              exact
              path="/chatbot-settings"
              element={<ChatbotSettings />}
            />
            <Route exact path="/chatbot-history" element={<ChatbotHistory />} />
            <Route
              exact
              path="/chatbot-realtime"
              element={<ChatbotRealtime />}
            />
            <Route exact path="/raffle" element={<Raffle />} />
            <Route exact path="*" element={<NotFound />} />
          </Routes>
          <NotificationContainer />
        </NavProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
