import React from "react";
import { IconButton, Modal, Paper, Typography } from "@mui/material";
import { Close, Visibility } from "@mui/icons-material";

const ProfileModal = ({ children, user }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton sx={{ display: "flex" }} onClick={handleOpen}>
          <Visibility />
        </IconButton>
      )}
      <Modal open={isOpen} onClose={handleClose}>
        <Paper
          sx={{
            position: "absolute",
            width: "80%",
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5">{user.name}</Typography>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <img
            src={user.pic}
            alt={user.name}
            style={{
              borderRadius: "50%",
              width: 150,
              height: 150,
              objectFit: "cover",
            }}
          />
          <Typography variant="body1">{user.email}</Typography>
        </Paper>
      </Modal>
    </>
  );
};

export default ProfileModal;
