import React, { useEffect } from "react";
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
import { useState } from "react";
import Navbar from "scenes/navbar";

const Profile = () => {
  const { friend, setFriend, user } = useContext(AppContext);
  console.log(user.user._id, user.accessToken);
  const [status, setStatus] = useState("");

  async function request() {
    try {
      const resp = await axios.post(
        `http://localhost:3001/auth/request/${friend._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log("hello", resp.data.data);
      setStatus(resp.data.data.status || "send");
    } catch (error) {
      console.log(error);
    }
  }

  const addFriend = async () => {
    try {
      const resp = await axios.post(
        `http://localhost:3001/auth/sendreq/${friend._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log(resp.data.data);
      setStatus(resp.data.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    request();
  }, [user._id, status]);

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
              onClick={addFriend}
              disabled={status !== "send"}
            >
              {status === "send" ? "ADD" : status}
            </Button>
            {friend?.connections?.includes(user._id) && (
              <Button variant="contained">Remove</Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
