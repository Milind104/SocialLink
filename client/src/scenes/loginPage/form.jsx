import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Checkbox,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

import Country from "./country"; // Importing the Country component
import Date from "./date";

const jobTitles = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "Business Analyst",
  "Marketing Manager",
];

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  jobtitle: yup.string().when("student", {
    is: false,
    then: yup.string().required("required"),
    otherwise: yup.string().notRequired(),
  }),
  Schoolcollegeunivercity: yup.string().required("required"),
  picture: yup.string().required("required"),
  // Add CountryRegion field to the schema
  CountryRegion: yup.string().required("required"),
  Date: yup.string().required("required"),
  age: yup
    .boolean()
    .oneOf([true], "You must be at least 17 years old")
    .required("required"),
  student: yup.boolean().required(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  jobtitle: "",
  Schoolcollegeunivercity: "",
  picture: "",
  CountryRegion: "",
  Date: "",
  age: false,
  student: false,
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) {
      // Submit the form only if the checkbox is checked
      if (values.age) {
        await register(values, onSubmitProps);
      } else {
        // Display an error message or perform any other action
        console.log("You must be at least 17 years old to register.");
      }
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />

                <Country
                  label="Country"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Country}
                  name="Country"
                  error={Boolean(touched.Country) && Boolean(errors.Country)}
                  helperText={touched.Country && errors.Country}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  select
                  label="Most recent job title"
                  value={values.jobtitle}
                  onChange={handleChange}
                  name="jobtitle"
                  error={Boolean(touched.jobtitle) && Boolean(errors.jobtitle)}
                  helperText={touched.jobtitle && errors.jobtitle}
                  disabled={values.student} // Disable if student is true
                  sx={{ gridColumn: "span 4" }}
                >
                  {jobTitles.map((title) => (
                    <MenuItem key={title} value={title}>
                      {title}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="School/college/univercity"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Schoolcollegeunivercity}
                  name="Schoolcollegeunivercity"
                  error={
                    Boolean(touched.Schoolcollegeunivercity) &&
                    Boolean(errors.Schoolcollegeunivercity)
                  }
                  helperText={
                    touched.Schoolcollegeunivercity &&
                    errors.Schoolcollegeunivercity
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                <Date />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>

                <Box
                  gridColumn="span 4"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <label htmlFor="student" style={{ marginRight: "0.5rem" }}>
                    I am a student
                  </label>
                  <div
                    style={{ display: "inline-block", position: "relative" }}
                  >
                    <input
                      id="student"
                      type="checkbox"
                      checked={values.student}
                      onChange={(e) =>
                        setFieldValue("student", e.target.checked)
                      }
                      style={{ display: "none" }}
                    />
                    <div
                      style={{
                        width: "40px",
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: values.student
                          ? palette.primary.main
                          : palette.action.disabledBackground,
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: palette.background.default,
                          position: "absolute",
                          top: "50%",
                          left: values.student ? "24px" : "4px",
                          transform: "translate(-50%, -50%)",
                          transition: "left 0.3s ease-in-out",
                        }}
                      />
                    </div>
                  </div>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            {isRegister && (
              <Box gridColumn="span 4">
                <Checkbox
                  checked={values.age}
                  onChange={(e) => setFieldValue("age", e.target.checked)}
                />
                <Typography>
                  I confirm that I am at least 17 years old
                </Typography>
              </Box>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
