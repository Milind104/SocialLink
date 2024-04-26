import { Box } from "@mui/material";

const UserImage = ({ profileImg, size = "60px" }) => {
  console.log(profileImg, "userimage components");
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={profileImg}
      />
    </Box>
  );
};

export default UserImage;
