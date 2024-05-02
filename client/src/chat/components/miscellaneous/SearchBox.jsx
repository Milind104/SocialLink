import * as React from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  ListItemButton,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import AppContext from "context/AppContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";
import FriendListWidget from "../../../scenes/widgets/FriendListWidget";
import Navbar from "scenes/navbar";

const SearchBox = () => {
  const { user, setFriend } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (event) => {
    const search = event.target.value;
    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/auth?search=${search}`,
        config
      );
      setSearchResults(data);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const change = (value) => {
    setFriend(value);
    navigate("/profile");
  };

  return (
    <>
      <Navbar />
      <Box mt={2} display="flex" justifyContent="space-between">
        <Card sx={{ flexBasis: "45%" }}>
          <CardContent>
            <TextField
              id="search"
              label="Search User"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChange}
            />
            {isLoading ? (
              <CircularProgress />
            ) : searchResults.length > 0 ? (
              <List space={2}>
                {searchResults.map((value) => (
                  <ListItem key={value._id} disableGutters>
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                          color: "green",
                        },
                      }}
                      onClick={() => change(value)}
                    >
                      <ListItemAvatar>
                        <UserImage profileImg={value.profileImg} />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{
                          "&:hover": {
                            textDecoration: "underline",
                            color: "blue",
                          },
                        }}
                        primary={` ${value.firstName} ${value.lastName}, ${value.occupation}, ${value.connections.length} `}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </CardContent>
        </Card>
        <Box width={20} /> {/* Space between cards */}
        <Card sx={{ flexBasis: "45%" }}>
          <CardContent>
            <FriendListWidget userId={user.id} />
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SearchBox;
