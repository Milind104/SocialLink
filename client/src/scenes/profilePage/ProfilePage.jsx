import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";
import { useContext } from "react";
import AppContext from "context/AppContext";
import UserImage from "components/UserImage";
import axios from "axios";
import Navbar from "scenes/navbar";

const Profile = () => {
  const { friend, user } = useContext(AppContext);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendFriendRequest() {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3001/auth/sendreq/${friend._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setStatus(response.data.data.status);
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function acceptFriendRequest() {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3001/auth/request/${friend._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setStatus(response.data.data.status || "send");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setStatus(friend.connectionStatus || "send");
  }, [friend.connectionStatus]);

  return (
    <>
      <Navbar />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 10,
              overflow: "hidden",
              padding: 2,
            }}
          >
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <UserImage profileImg={friend.profileImg} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${friend.firstName} ${friend.lastName}`}
                  secondary={friend.email}
                />
              </ListItem>
            </List>
            <Button
              variant="contained"
              onClick={
                friend.connectionStatus === "send"
                  ? sendFriendRequest
                  : acceptFriendRequest
              }
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : status === "send"
                ? "Add Friend"
                : status}
            </Button>
            {friend.connectionStatus === "accepted" && (
              <Button variant="contained">Remove</Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
