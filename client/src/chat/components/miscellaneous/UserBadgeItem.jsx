import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderRadius: "lg",
        m: 1,
        mb: 2,
        variant: "solid",
        fontSize: 12,
        color: "white",
        backgroundColor: "#38B2AC",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
    >
      {user.name}
      <IconButton onClick={handleFunction}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default UserBadgeItem;
