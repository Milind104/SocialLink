import React, { useEffect, useState } from "react";
import axios from "axios";
import UserImage from "components/UserImage";
import { Button, Card, CardContent, Typography } from "@mui/material";

const FriendPage = ({ request, token, status, setStatus }) => {
  const [friend, setFriend] = useState(null);

  const profile = () => {
    axios
      .get(`http://localhost:3001/auth/profile/${request.sender}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setFriend(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const acceptReq = async () => {
    await axios
      .post(
        `http://localhost:3001/auth/accept/${request._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setStatus(!status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rejectReq = () => {
    axios
      .delete(`http://localhost:3001/auth/${request.receiver}/${request._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setStatus(!status);
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
        {friend && (
          <>
            <UserImage profileImg={friend.profileImg} />
            <Typography variant="h5" component="h2">
              {friend.firstName} {friend.lastName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {friend.occupation}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Email: {friend.email}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {friend.connections.length} connections
            </Typography>

            <Button onClick={acceptReq}>Accept</Button>
            <Button onClick={rejectReq}>Reject</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendPage;
