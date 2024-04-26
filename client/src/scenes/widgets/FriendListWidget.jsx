import { Box, Typography, useTheme } from "@mui/material";
import axios from "axios";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/connections/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //  console.log(response.data, "Response from get Friends.......");
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      const data = response.data.data;
      dispatch(setFriends({ friends: response.data.data }));
    } catch (error) {
      console.error("Error fetching friends:", error.message);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

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
