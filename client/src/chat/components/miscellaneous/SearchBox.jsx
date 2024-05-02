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
  Typography,
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
        <Card sx={{ flexBasis: "45%", boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search User
            </Typography>
            <TextField
              id="search"
              label="Enter Name"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            {isLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : searchResults.length > 0 ? (
              <List>
                {searchResults.map((value) => (
                  <ListItem
                    key={value._id}
                    disableGutters
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemButton onClick={() => change(value)}>
                      <ListItemAvatar>
                        <UserImage profileImg={value.profileImg} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${value.firstName} ${value.lastName}`}
                        secondary={`${value.occupation}, ${value.connections.length} connections`}
                        sx={{
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No results found
              </Typography>
            )}
          </CardContent>
        </Card>
        <Box width={20} />
        <Card sx={{ flexBasis: "45%", boxShadow: 2 }}>
          <CardContent>
            <FriendListWidget userId={user.id} />
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SearchBox;
