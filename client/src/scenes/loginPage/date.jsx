import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const DatePicker = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <Box display="flex" justifyContent="space-between">
      <Box marginRight={2}>
        <p style={{ marginBottom: "5px" }}>Starting Year:</p>
        <TextField
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          inputRef={startDateInputRef}
          sx={{ marginBottom: "20px", width: "100%" }}
        />
      </Box>
      <Box marginLeft={2}>
        <p style={{ marginBottom: "5px" }}>Ending Year:</p>
        <TextField
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          inputRef={endDateInputRef}
          sx={{ marginBottom: "20px", width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default DatePicker;
