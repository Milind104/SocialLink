import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import state from "state";
import { Button, Card, CardContent, Typography } from "@mui/material";
import UserImage from "components/UserImage";
const FriendPageList = ({ friend }) => {
  const [Friend, setFriend] = useState();
  const token = useSelector((state) => state.token);
  console.log(friend, "Hello");
  const profile = () => {
    axios
      .get(`http://localhost:3001/auth/profile/${friend}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        console.log("ans we get ......", resp.data.data);
        setFriend(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    profile();
  }, []);
  return (
    <Card>
      <CardContent>
        {Friend && (
          <>
            <UserImage profileImg={Friend.profileImg} />
            <Typography variant="h5" component="h2">
              {Friend.firstName} {Friend.lastName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {Friend.occupation}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Email: {Friend.email}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {Friend.connections.length} connections
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendPageList;
