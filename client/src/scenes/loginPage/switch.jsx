import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import { Box, Typography } from "@mui/material";

const Switches = () => {
  const [state, setState] = useState({
    checkedB: true,
  });

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body1">I am a student</Typography>
      <Switch
        checked={state.checkedB}
        onChange={handleChange("checkedB")}
        value="checkedB"
        color="primary"
      />
    </Box>
  );
};

export default Switches;
