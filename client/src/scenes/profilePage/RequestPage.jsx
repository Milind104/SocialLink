import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import { setFriends } from "state";
import FriendPage from "./FriendPage";
import { Tonality } from "@mui/icons-material";

const RequestPage = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [friend, setFriend] = useState(null);
  const [status, setStatus] = useState(false);
  const [req, setReq] = useState(null);
  console.log("first......", token);
  const pendingRequests = async () => {
    const url = `http://localhost:3001/auth/pendingreq`;
    const config = { Authorization: `Bearer ${token}` };
    const resp = await axios.post(
      url,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (resp.data.data.length === 0) setReq(null);
    else {
      // const request = resp.data.data.map((ele) => {return {y : ele._id, x : ele.reciever}});
      console.log(resp.data.data);
      setReq(resp.data.data);
    }
  };
  useEffect(() => {
    try {
      pendingRequests();
      console.log(friend, "response data", req);
    } catch (error) {
      console.log(error);
    }
  }, [user]);
  useEffect(() => {
    console.log(friend, "response data", req); // Move logging inside useEffect
  }, [req, status]);
  return (
    <>
      <Navbar />
      {req && req.length !== 0 ? (
        req.map((req) => {
          return (
            <FriendPage
              request={req}
              token={token}
              status={status}
              setStatus={setStatus}
            />
          );
        })
      ) : (
        <div>No pending requests</div>
      )}
    </>
  );
};

export default RequestPage;
