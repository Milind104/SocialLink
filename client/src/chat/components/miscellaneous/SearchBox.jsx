import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemButton,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import AppContext from "context/AppContext";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SearchBox = () => {
  const { user, setselectedChat, Chats, setChats } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const user = useSelector((state) => state.user);

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

  const handleAddConnection = async (userId) => {
    // Add logic to add connection
    console.log("connections.....", userId, user.accessToken);
    const { data } = await axios.post(
      `http://localhost:3001/auth/connect/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    console.log("Adding connection with user id:", userId, data);
  };

  const handleRemoveConnection = (userId) => {
    // Add logic to remove connection
    console.log("Removing connection with user id:", userId);
  };

  return (
    <div>
      <TextField
        id="search"
        label="Search User"
        variant="outlined"
        size="small"
        fullWidth
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <i className="fas fa-search"></i>
            </InputAdornment>
          ),
        }}
      />
      {isLoading ? (
        <CircularProgress />
      ) : searchResults.length > 0 ? (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {searchResults.map((value) => (
            <ListItem
              key={value._id}
              disableGutters
              secondaryAction={
                <div>
                  {value.connections.length === 0 ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAddConnection(value._id)}
                    >
                      Add
                    </Button>
                  ) : (
                    value.connections.map((connection) => {
                      connection._id == user._id ? (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveConnection(value._id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAddConnection(value._id)}
                        >
                          Add
                        </Button>
                      );
                    })
                  )}
                  {/* <Stack direction="row" spacing={2}></Stack> */}
                </div>
              }
            >
              <ListItemButton
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                    color: "green",
                  },
                }}
                component={Link}
                to={`/profile/${value._id}`}
              >
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
    </div>
  );
};

export default SearchBox;
