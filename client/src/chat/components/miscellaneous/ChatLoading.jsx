import React from "react";
import { Grid, Skeleton } from "@mui/material";

const ChatLoading = () => {
  return (
    <Grid container spacing={2}>
      {[...Array(12)].map((_, index) => (
        <Grid item xs={12} key={index}>
          <Skeleton variant="rectangular" height={45} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatLoading;
