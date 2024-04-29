import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import axios from "axios";
import { useEffect } from "react";
const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.connections);
  console.log("This is from Friendjsx.....");
  console.log("friendid", friendId);
  console.log("name", name);
  console.log("subtitle", subtitle);
  console.log("userpicture", userPicturePath);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);
  console.log("isFriend bdhgwhd", friends);

  const patchFriend = async () => {
    const response = await axios.get(
      `http://localhost:3001/auth/connections/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("friend img", response.data.data);
    // const data = await response.json();
    dispatch(setFriends({ friends: response.data.data }));
  };
  // console.log("userPicturePath:", userPicturePath);
  // const ans = async () => {
  //   const response = await axios.get(
  //     `http://localhost:3001/auth/image/${friendId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   // console.log("friend img", response.data.data);
  //   // userPicturePath = response.data.data;
  //   // console.log(
  //   //   "this is your ans from .............................",
  //   //   userPicturePath
  //   // );
  // };
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage profileImg={userPicturePath} size="55px" />

        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
