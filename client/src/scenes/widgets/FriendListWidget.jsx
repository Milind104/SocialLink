import { Box, Typography, useTheme } from "@mui/material";
import axios from "axios";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendPageList from "scenes/profilePage/FriendPageList";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);

  const friends = useSelector((state) => state.user.connections);
  // const [friends, setFriends] = useState([]);
  console.log("first...........................", friends, userId);
  const getFriends = async () => {
    try {
      console.log("get friends.............");
      const response = await axios.get(
        `http://localhost:3001/auth/connections/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response.data.data, "Response from get Friends.......");
      if (!response.data.data) {
        throw new Error("Failed to fetch friends");
      }
      //const fetchedFriends = response.data.data;
      const data = response.data.data;
      console.log(data, "This is answer from the friendlist");
      // setFriends(data);
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error fetching friends:", error.message);
    }
  };
  // console.log("before useeffect...................");
  useEffect(() => {
    getFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  // console.log("Number of friends:............", friends);
  // useEffect(() => {
  //   const friends = useSelector((state) => state.user.following); // Define friends here
  //   console.log("Number of friends:", friends.length); // Log the length
  //   getFriends();
  // }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        {friends.length} Connections
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.length > 0 ? (
          // { friends }
          friends.map((friend) => <FriendPageList friend={friend} />)
        ) : (
          <Typography>No friends to display</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
