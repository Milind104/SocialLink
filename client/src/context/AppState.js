import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { useNavigate } from "react-router-dom";
const AppState = (props) => {
  // save logged in user
  const [user, setuser] = useState();
  // chat we selected
  const [selectedChat, setselectedChat] = useState();
  // all chats users have
  const [Chats, setChats] = useState([]);
  // to fetch chat again if needed
  const [fetchAgain, setfetchAgain] = useState(false);
  // to fetch friend
  const [friend, setFriend] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setuser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        setuser,
        user,
        setselectedChat,
        selectedChat,
        Chats,
        setChats,
        fetchAgain,
        setfetchAgain,
        friend,
        setFriend,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
export default AppState;

// import AppContext from "./AppContext";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// const AppState=(props)=>{
//   const authtoken = localStorage.getItem('token');
//   const saved = localStorage.getItem('user');
//   const [user, setuser] = useState(saved);
//   const [alert, setalert] = useState(null);
//   const host= `http://localhost:4000`;
//   const navigate = useNavigate(null);

//   const login = async({Email,Password})=>{
//     const url = `${host}/auth/login`;
//     await axios.post(url,{Email,Password})
//     .then((data)=>{
//         console.log(data);
//         setData(data);
//         navigate('chat');
//         showAlert("loggedIn","success");
//     }).catch((Error)=>{
//         console.log(Error);
//         showAlert("Try Again!!!","danger");
//     });
//   }
//   const signup = async({Email,Password})=>{
//     const url = `${host}/auth/signup`;
//     await axios.post(url,{Email,Password})
//     .then((data)=>{
//         console.log(data);
//         navigate('chat');
//         showAlert("loggedIn","success");
//     }).catch((Error)=>{
//         console.log(Error);
//         showAlert("Try Again!!!","danger");
//     });
//   }
//   const showAlert=(message,type)=>{
//     setalert({
//       msg:message,
//       type:type
//     })
//     console.log("hello alert");
//     setTimeout(() => {
//       setalert(null);
//     }, 3000);
//   }
//   const setData = ({data})=>{
//     localStorage.setItem('user',data);
//     setuser(data);
//   }
//     return (
//         <AppContext.Provider value={{login,signup,alert,user}}>
//           {props.children}
//         </AppContext.Provider>
//     )
// }
// export default AppState;
