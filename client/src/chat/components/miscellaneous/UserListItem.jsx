import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bgcolor="#E8E8E8"
      sx={{
        "&:hover": {
          background: "#69738E",
          color: "white",
        },
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={1}
      mb={1}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        sx={{ cursor: "pointer" }}
        src={user.pic}
        alt={user.name}
        sizes="sm"
      />
      <Box>
        <Typography variant="body1">{user.name}</Typography>
        <Typography variant="body2">
          <b>Email:</b> {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
