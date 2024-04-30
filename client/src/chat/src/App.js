import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import AppState from "./context/AppState";
function App() {
  return (
    <Router>
      <AppState>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <Routes>
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
        </div>
      </AppState>
    </Router>
  );
}

export default App;

// // import logo from './logo.svg';
// import './App.css';
// // import Login from './components/Login'
// // import Chat from './components/Chat';
// import Auth from './components/Auth'
// import MyForm from './components/MyForm';
// import AppState from './context/AppState';
// import Alert from './components/Alert';
// import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import { useContext } from 'react';
// import AppContext from './context/AppContext';
// import ChatDashboard from './components/ChatDashboard';
// import ChatApp from './components/temp/ChatApp';
// function App() {
//   // const {user} = useContext(AppContext);
//   return (
//     //   <Router>
//     //   <AppState>
//     // <div className="App">
//     // <Alert/>
//     // <Routes>
//     //     <Route path="/" element={<MyForm/>} />
//     // </Routes>
//     // <Routes>
//     //     <Route path="/log" element={<Auth/>} />
//     // </Routes>
//     // <Routes>
//     //     <Route path="/chat" element={<ChatDashboard/>} />
//     // </Routes>
//     // <Routes>
//     //     <Route path="/chattemp" element={<ChatApp/>} />
//     // </Routes>

//       {/* <Login/> */}
//       {/* <Chat/> */}
//       {/* <Auth></Auth> */}
//     </div>
//       </AppState>
//     </Router>
//   );
// }

// export default App;
