import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import EditPostWidget from "./EditPostWidget";
import axios from "axios";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  console.log("post before .....", posts, token);
  const [first, setfirst] = useState(true);
  const getPosts = async () => {
    try {
      console.log("getposts function runnig....");
      const response = await axios.get(`http://localhost:3001/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPosts({ posts: response.data.data }));
      setfirst(!first);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching posts:", error);
    }
  };

  // const getPosts = async () => {
  //   const response = await fetch("http://localhost:3001/posts", {
  //     method: "GET",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await response.json();
  //   dispatch(setPosts({ posts: data }));
  // };

  const getUserPosts = async () => {
    try {
      console.log("get user post");
      const response = await axios.get(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("after get post", response.data.data);
      dispatch(setPosts({ posts: response.data.data }));
      setfirst(!first);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching user posts:", error);
    }
  };

  // const getUserPosts = async () => {
  //   const response = await fetch
  //     `http://localhost:3001/posts/${userId}/posts`,
  //     {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   const data = await response.json();
  //   dispatch(setPosts({ posts: data }));
  // };
  console.log("hello this is from before postwidgete.....");
  useEffect(() => {
    console.log("hello this is from postsWidgets .....");
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId, isProfile]); // Updated the dependencies

  const [editPostId, setEditPostId] = useState(null);

  const handleEditClick = (postId) => {
    setEditPostId(postId);
  };

  // const handleDeleteClick = async (postId) => {
  //   const response = await fetch(`http://localhost:3001/posts/${postId}`, {
  //     method: "DELETE",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   if (response.ok) {
  //     // Remove the deleted post from the Redux store
  //     const updatedPosts = posts.filter((post) => post._id !== postId);
  //     dispatch(setPosts({ posts: updatedPosts }));
  //   }
  // };

  const handleDeleteClick = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        // Remove the deleted post from the Redux store
        const updatedPosts = posts.filter((post) => post._id !== postId);
        dispatch(setPosts({ posts: updatedPosts }));
      }
    } catch (error) {
      // Handle errors here
      console.error("Error deleting post:", error);
    }
  };

  const handleEditClose = () => {
    setEditPostId(null);
  };

  return (
    <>
      {posts.map(
        ({
          _id,
          createdBy,
          text,
          likeCount,
          repostCount,
          commentCount,
          image,
          video,
        }) => (
          <React.Fragment key={_id}>
            <PostWidget
              postId={_id}
              postUserId={createdBy}
              // name={`${firstName} ${lastName}`}
              name="test"
              description={text}
              // location={location}
              location="testlocation"
              picturePath={image[0]}
              // userPicturePath={userPicturePath}
              userPicturePath="testuserPicturePath"
              likes={likeCount}
              comments={commentCount}
              userId={userId}
              handleEditClick={handleEditClick} // Pass the handleEditClick function to PostWidget
              handleDeleteClick={handleDeleteClick} // Pass the handleDeleteClick function to PostWidget
            />
            {editPostId === _id && ( // Show the EditPostWidget if editPostId matches the current post id
              <EditPostWidget
                postId={_id}
                description={
                  posts.find((post) => post._id === editPostId).description
                }
                picturePath={
                  posts.find((post) => post._id === editPostId).picturePath
                }
                onClose={handleEditClose}
              />
            )}
          </React.Fragment>
        )
      )}
    </>
  );
};

export default PostsWidget;
