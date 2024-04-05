import { useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DarkMode, LightMode, Menu, Close } from "@mui/icons-material";

import ArticleIcon from "@mui/icons-material/Article";

import WorkIcon from "@mui/icons-material/Work";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PeopleIcon from "@mui/icons-material/People";

import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "";
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: "darkblue",
              cursor: "pointer",
            },
          }}
        >
          SocialLink
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          ></FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>

          <ArticleIcon sx={{ fontSize: "25px" }} />
          <PeopleIcon sx={{ fontSize: "25px" }} />
          <VideoLibraryIcon sx={{ fontSize: "25px" }} />
          <WorkIcon sx={{ fontSize: "25px" }} />
          <Stack direction="row" spacing={2} sx={{ margin: "15px" }}>
            <Button variant="contained">Join now</Button>

            <Button variant="contained" href="#contained-buttons">
              Sign in
            </Button>
          </Stack>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <ArticleIcon sx={{ fontSize: "25px" }} />
            <PeopleIcon sx={{ fontSize: "25px" }} />
            <VideoLibraryIcon sx={{ fontSize: "25px" }} />
            <WorkIcon sx={{ fontSize: "25px" }} />
            <Stack spacing={2} sx={{ margin: "15px" }}>
              <Button variant="contained">Join now</Button>

              <Button variant="contained" href="#contained-buttons">
                Sign in
              </Button>
            </Stack>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
