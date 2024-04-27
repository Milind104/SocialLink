import { Box, Typography, useTheme } from "@mui/material";
import axios from "axios";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);

  // const friends = useSelector((state) => state.user.following);
  const [friends, setFriends] = useState([]);
  // console.log("first...........................", friends);
  async function getFriends() {
    console.log("get friends.............");
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/connections/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data, "Response from get Friends.......");
      if (!response.data.success) {
        throw new Error("Failed to fetch friends");
      }
      //const fetchedFriends = response.data.data;
      const data = response.data.data;
      console.log(data);
      setFriends(data);
      dispatch(setFriends({ friends: response.data.data }));
    } catch (error) {
      console.error("Error fetching friends:", error.message);
    }
  }
  console.log("before useeffect...................");
  useEffect(() => {
    getFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log("Number of friends:............", friends);
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
        Friend List
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <Typography>No friends to display</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
