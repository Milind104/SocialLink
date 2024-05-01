import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Temp from "Temp";
import AppState from "context/AppState";
import ChatPage from "chat/Pages/ChatPage";
import SearchBox from "chat/components/miscellaneous/SearchBox";
function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <AppState>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/temp" element={<Temp />} />
              <Route path="/chats" element={<ChatPage />} />
              <Route path="/search" element={<SearchBox />} />
            </Routes>
          </ThemeProvider>
        </AppState>
      </BrowserRouter>
    </div>
  );
}
export default App;
