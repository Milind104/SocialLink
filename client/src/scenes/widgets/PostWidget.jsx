import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import axios from "axios";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  userId,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const secondary = palette.secondary.main;
  console.log(
    "post widget ... ",
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
    userId
  );
  // const patchLike = async () => {
  //   const response = await axios.patch(`http://localhost:3001/posts/${postId}/like`, {

  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userId: loggedInUserId }),
  //   });
  //   const updatedPost = await response.json();
  //   dispatch(setPost({ post: updatedPost }));
  // };
  const patchLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${postId}/like`,
        { userId: loggedInUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("patch like ", response.data.data);
      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      // Handle error
      console.error("Error patching like:", error);
    }
  };

  const handleCommentPost = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/posts/create-comment`,
        {
          postId, // The ID of the post for which the comment is being created
          userId, // The ID of the user creating the comment
          text: commentText, // The text of the comment
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // If the comment is successfully posted, update the post data to include the new comment
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));
        setCommentText(""); // Clear the comment input field after posting
      } else {
        // Handle error response from the server if needed
        // For example, display an error message to the user
        console.error("Error posting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  // useEffect(async () => {
  //   const response = await axios.get(
  //     `http://localhost:3001/auth/image/${postUserId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   console.log("friend img", response.data.data);
  //   return (userPicturePath = response.data.data);
  // }, [postUserId]);
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={picturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>

        {loggedInUserId === postUserId && (
          <FlexBetween>
            <IconButton onClick={() => handleEditClick(postId)}>
              <EditOutlined />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(postId)}>
              <DeleteOutlined />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {isComments && (
        <Box mt="1rem">
          <Divider />

          {/* Comments */}
          {comments.length > 0 && (
            <Box mt="1rem">
              {comments.map((comment, i) => (
                <Box
                  key={`${name}-${i}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    mb: "0.5rem",
                  }}
                >
                  <Box sx={{ fontWeight: "bold", color: secondary }}>
                    {comment.username}:
                  </Box>
                  <Typography>{comment.text}</Typography>
                </Box>
              ))}
              <Divider />
            </Box>
          )}

          {/* Comment Input */}
          <Box mt="1rem" display="flex" alignItems="center">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                borderRadius: "1rem",
                padding: "0.5rem 1rem",
              }}
            />
            <button
              onClick={handleCommentPost}
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
                backgroundColor: primary,
                color: "white",
              }}
            >
              Post
            </button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
